import {
  useQuery as useReactQuery,
  useMutation,
  useQueryClient,
} from "react-query";
import {
  PostgrestQueryBuilder,
  PostgrestFilterBuilder,
  PostgrestBuilder,
} from "@supabase/postgrest-js";
import { supastruct } from "supastruct";
import { getMetaFromQuery } from "supastruct";
import {
  buildSupabaseErrorMessage,
  getCoupledMutationQueryMeta,
  getKeyFromMeta,
  invalidateCache,
} from "./helpers";
import { optimisticallyMutateCache } from "./optimisticallyMutateCache";
import { mutateWrapper } from "./mutateWrapper";
import type { QueryMeta, SupastructFilterBuilder } from "supastruct";
import type { CoupledMutateCallbacks, UseQueryOptions } from "./types";

export function useQuery(
  query:
    | PostgrestQueryBuilder<any, any>
    | PostgrestFilterBuilder<any, any, any>
    | PostgrestBuilder<any>,
  options?: UseQueryOptions
) {
  const { primaryKey = "id", queryOptions } = options ?? {};

  if (query instanceof PostgrestQueryBuilder) query = query.select(); // this line allows people to not have to always specify `select()` if it's a generic table-wide select.. we add it for them, so they can just write `db.from("todos")`
  const finalQuery = query as SupastructFilterBuilder; // `finalQuery` only exists for type assertion

  const queryMeta = getMetaFromQuery(finalQuery);
  const queryKey = getKeyFromMeta(queryMeta);

  const queryResponse = useReactQuery(
    queryKey,
    async () => {
      const { data, error } = await finalQuery;
      if (error) throw buildSupabaseErrorMessage(error);
      return data;
    },
    queryOptions
  );

  // ========================
  // Set up coupled mutation:
  // ========================

  const supabaseClient = finalQuery.getSupabaseClient();
  const queryClient = useQueryClient();

  const { mutate, mutateAsync, ...rest } = useMutation(
    async (partialMutationQueryMeta: Partial<QueryMeta>) => {
      const { mergedQueryMeta } = getCoupledMutationQueryMeta(
        partialMutationQueryMeta,
        queryMeta
      );

      // execute the mutation query:
      const { data, error } = await supastruct(supabaseClient, mergedQueryMeta);

      if (error) throw buildSupabaseErrorMessage(error); // triggers `onError` callback

      return data; // gets passed to `onSuccess` and `onSettled` as 1st arg
    },
    {
      // The following methods enable Optimistic Updates (see: https://react-query.tanstack.com/guides/optimistic-updates)
      /**
       * onMutate() will fire before the above mutation function is fired and is passed the same variables it receives.
       * We use it to optimistically update the locally cached records from the original query in the hopes that the mutation
       * succeeds, resulting in very snappy UI updates since we don't wait for the DB response before re-rendering the mutated
       * data. See `onError` (below) to see how we roll back failed mutations, and `onSettled` (below) to see how we always
       * invalidate the cache to force a refetch (which will essentially override the optimistic update with the real data
       * a second later -- that small amount of gained time still makes a substantial UI/UX difference).
       */
      onMutate: async (partialMutationQueryMeta) => {
        const { previousData } = await optimisticallyMutateCache({
          partialMutationQueryMeta,
          queryMeta,
          queryKey,
          queryClient,
          primaryKey,
        });

        return { previousData };
      },

      // If the mutation fails, use the context returned from onMutate to roll back to previous state from before the optimistic update
      onError: (err, partialMutationQueryMeta, context) => {
        // globalMutationOptions?.onError?.(err, newData, context); // call user-provided custom onError
        console.error(
          `Failed to run "${partialMutationQueryMeta.mutation}" coupled mutation for query with key of "${queryKey}". Error: ${err}`
        );
        const { previousData } = context ?? {};
        if (previousData) queryClient.setQueryData(queryKey, previousData);
      },

      // onSuccess: () => {
      // globalMutationOptions?.onSuccess?.(props); // call user-provided custom onSuccess
      // },

      onSettled: (data) => {
        // globalMutationOptions?.onSettled?.(props); // call user-provided custom onSettled

        console.log("onSettled result: ", data);
        // Always refetch after error or success:
        invalidateCache(queryClient, queryKey);
      },
    }
  );

  const mutateWrapperOptions = {
    primaryKey,
    supabaseClient,
    queryMeta,
  };

  const result = {
    queryKey,
    queryMeta,
    ...queryResponse,
    mutate: (mutateCallbacks?: CoupledMutateCallbacks) =>
      mutateWrapper(
        (variables) => mutate(variables, mutateCallbacks),
        mutateWrapperOptions
      ),
    mutateAsync: (mutateCallbacks?: CoupledMutateCallbacks) =>
      mutateWrapper(
        (variables) => mutateAsync(variables, mutateCallbacks),
        mutateWrapperOptions
      ),
    mutationState: { ...rest },
    invalidateCache: () => invalidateCache(queryClient, queryKey),
  };

  return result;
}
