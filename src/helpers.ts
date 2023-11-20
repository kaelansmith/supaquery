import { getMetaFromQuery } from "supastruct";
import { QueryClient } from "react-query";
import type { PostgrestError } from "@supabase/supabase-js";
import type { QueryKey } from "./types";
import type { QueryMeta } from "supastruct";

export const getKeyFromMeta = (queryMeta: QueryMeta): QueryKey => {
  let queryKey = [queryMeta.from] as QueryKey;

  if (queryMeta.filters)
    queryKey.push(sortObjectKeysAlphabetically(queryMeta.filters)); // note: we order the queryMeta properties alphabetically so that the queryKey hash is consistent

  if (queryMeta.modifiers)
    queryKey.push(sortObjectKeysAlphabetically(queryMeta.modifiers));

  return queryKey;
};

const sortObjectKeysAlphabetically = (obj: Record<string, any>) => {
  const sortedObj = {} as Record<string, any>;
  Object.keys(obj)
    .sort()
    .forEach((key) => {
      sortedObj[key] = obj[key];
    });
  return sortedObj;
};

/**
 * A coupled mutation must merge the queryMeta from its initial query with its own additional
 * queryMeta before being executed -- `getCoupledMutationQueryMeta` handles this merging.
 */
export const getCoupledMutationQueryMeta = (
  partialMutationQueryMeta: Partial<QueryMeta>,
  initialQueryMeta: QueryMeta
) => {
  const { mutation } = partialMutationQueryMeta;
  let mergedQueryMeta: QueryMeta;
  let mutationQueryMeta: Partial<QueryMeta>;

  if (typeof mutation == "string") {
    // abstracted mutation (`mutate` option #1):
    // const { mutationOptions } = partialMutationQueryMeta;

    mutationQueryMeta = {
      ...partialMutationQueryMeta,
    };

    // if (mutation != 'delete')
    //   mutationQueryMeta.values = partialMutationQueryMeta.values;
    // if (mutationOptions) mutationQueryMeta.mutationOptions = mutationOptions;

    // TODO: need to manually set some filters depending on mutation:
    //    - "delete" needs to set `eq: [primaryKey, values]`, or using `in` instead of `eq` if values is an array
    //    - "update" needs

    // inject the additional mutation methods/args into the original query:
    mergedQueryMeta = {
      ...initialQueryMeta,
      ...partialMutationQueryMeta,
    };
  } else {
    // custom mutation (`mutate` option #2):
    mutationQueryMeta = getMetaFromQuery(mutation);

    // inject the additional mutation methods/args into the original query:
    mergedQueryMeta = {
      ...initialQueryMeta,
      ...mutationQueryMeta,
      filters: {
        ...initialQueryMeta.filters,
        ...mutationQueryMeta.filters,
      },
      modifiers: {
        ...initialQueryMeta.modifiers,
        ...mutationQueryMeta.modifiers,
      },
    };
  }

  return { mergedQueryMeta, mutationQueryMeta };
};

export const buildSupabaseErrorMessage = (error: PostgrestError) => {
  return `Supabase error. Code: ${error.code}. Details: ${error.details}. Hint: ${error.hint}. Message: ${error.message}.`;
};

/**
 * We extract the following cache invalidation logic into a separate function, which we return alongside the useQuery result.
 * This allows users to easily invalidate the cache(s) associated with this particular query/mutation manually (which isn't a
 * frequent need but still useful).
 */
export const invalidateCache = (
  queryClient: QueryClient,
  queryKey: QueryKey
) => {
  console.log("Invalidating cache for key: ", queryKey);
  queryClient.invalidateQueries(queryKey);
  if (queryKey?.length > 1) {
    // eg. if we invalidated ["estimates", {"eq":["id": 1]}], this line ensures we also invalidate the root key of "estimates", so any queries starting with ["estimates", ...] will also get invalidated
    queryClient.invalidateQueries(queryKey[0]);
  }
};
