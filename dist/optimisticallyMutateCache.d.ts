import { OptimisticMutateCacheProps } from "./types";
export declare const optimisticallyMutateCache: ({ mutationQueryMeta, queryKey, queryClient, primaryKey, }: OptimisticMutateCacheProps) => Promise<{
    previousData: unknown;
}>;
