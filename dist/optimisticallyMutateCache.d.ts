import { OptimisticMutateCacheProps } from "./types";
export declare const optimisticallyMutateCache: ({ partialMutationQueryMeta, queryMeta, queryKey, queryClient, primaryKey, }: OptimisticMutateCacheProps) => Promise<{
    previousData: unknown;
}>;
