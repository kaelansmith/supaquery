import { PostgrestFilterBuilder, PostgrestQueryBuilder } from "@supabase/postgrest-js";
import { QueryClient } from "react-query";
export declare const prefetchQuery: (query: PostgrestQueryBuilder<any, any> | PostgrestFilterBuilder<any, any, any>, queryClient: QueryClient) => Promise<{
    error: import("@supabase/postgrest-js").PostgrestError;
    data: null;
    count: null;
    status: number;
    statusText: string;
    queryKey: import("./types").QueryKey;
} | {
    error: null;
    data: any;
    count: number;
    status: number;
    statusText: string;
    queryKey: import("./types").QueryKey;
}>;
