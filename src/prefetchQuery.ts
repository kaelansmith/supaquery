import {
  PostgrestFilterBuilder,
  PostgrestQueryBuilder,
} from "@supabase/postgrest-js";
import { getKeyFromMeta } from "./helpers";
import { getMetaFromQuery } from "supastruct";
import { QueryClient } from "react-query";

export const prefetchQuery = async (
  query:
    | PostgrestQueryBuilder<any, any>
    | PostgrestFilterBuilder<any, any, any>,
  queryClient: QueryClient
) => {
  if (query instanceof PostgrestQueryBuilder) query = query.select();
  const queryMeta = getMetaFromQuery(query);
  const queryKey = getKeyFromMeta(queryMeta);
  const response = await query;
  queryClient.prefetchQuery(queryKey, () => Promise.resolve(response.data));
  return { queryKey, ...response };
};
