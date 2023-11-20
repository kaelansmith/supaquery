import { PostgrestFilterBuilder, PostgrestQueryBuilder } from "@supabase/postgrest-js";
import { QueryClient } from "react-query";
export declare const prefetchQueries: (queries: PostgrestQueryBuilder<any, any>[] | PostgrestFilterBuilder<any, any, any>[], queryClient: QueryClient) => Promise<any[]>;
