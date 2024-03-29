import {
  CustomMutationVariables,
  DeleteVariables,
  InsertVariables,
  QueryMeta,
  UpdateVariables,
  UpsertVariables,
} from "supastruct";
import {
  MutateOptions,
  QueryClient,
  UseMutateAsyncFunction,
  UseMutateFunction,
} from "react-query";
import { SupabaseClient } from "@supabase/supabase-js";
import {
  PostgrestQueryBuilder,
  PostgrestFilterBuilder,
} from "@supabase/postgrest-js";

import { UseQueryOptions as UseReactQueryOptions } from "react-query";

export type QueryKey = any[];

export type UseQueryOptions = {
  primaryKey?: string;
  queryOptions?: Omit<UseReactQueryOptions, "queryKey" | "queryFn">;
  unallowedIds?: string[];
  // TODO: consider adding `globalMutationOptions` as 3rd arg
};

export type CoupledMutationVariables =
  | CustomMutationVariables
  | UpdateVariables
  | InsertVariables
  | UpsertVariables
  | DeleteVariables;

export type CustomMutationGetter = (
  queryBuilder: PostgrestQueryBuilder<any, any>
) => PostgrestFilterBuilder<any, any, any>;

export type MutateFunction<
  TData = any,
  TError = unknown,
  TVariables = Partial<QueryMeta>,
  TContext = {
    previousData: unknown;
  }
> =
  | UseMutateFunction<TData, TError, TVariables, TContext>
  | UseMutateAsyncFunction<TData, TError, TVariables, TContext>;

export type MutateWrapperOptions = {
  primaryKey: string;
  supabaseClient: SupabaseClient;
  queryMeta: QueryMeta;
};

export type OptimisticMutateCacheProps = {
  mutationQueryMeta: Partial<QueryMeta>;
  queryKey: QueryKey;
  queryClient: QueryClient;
  primaryKey: string;
};

export type CoupledMutateCallbacks = MutateOptions<
  any,
  unknown,
  Partial<QueryMeta>,
  { previousData: unknown }
>;
