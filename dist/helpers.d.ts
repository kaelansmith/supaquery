import { QueryClient } from "react-query";
import type { PostgrestError } from "@supabase/supabase-js";
import type { QueryKey } from "./types";
import type { QueryMeta } from "supastruct";
export declare const getKeyFromMeta: (queryMeta: QueryMeta) => QueryKey;
/**
 * A coupled mutation must merge the queryMeta from its initial query with its own additional
 * queryMeta before being executed -- `getCoupledMutationQueryMeta` handles this merging.
 */
export declare const getCoupledMutationQueryMeta: (partialMutationQueryMeta: Partial<QueryMeta>, initialQueryMeta: QueryMeta) => {
    mergedQueryMeta: QueryMeta;
    mutationQueryMeta: Partial<QueryMeta>;
};
export declare const buildSupabaseErrorMessage: (error: PostgrestError) => string;
/**
 * We extract the following cache invalidation logic into a separate function, which we return alongside the useQuery result.
 * This allows users to easily invalidate the cache(s) associated with this particular query/mutation manually (which isn't a
 * frequent need but still useful).
 */
export declare const invalidateCache: (queryClient: QueryClient, queryKey: QueryKey) => void;
