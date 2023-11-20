import {
  PostgrestFilterBuilder,
  PostgrestQueryBuilder,
} from "@supabase/postgrest-js";
import { getKeyFromMeta } from "./helpers";
import { getMetaFromQuery } from "supastruct";
import { QueryClient, QueryKey } from "react-query";

export const prefetchQueries = async (
  queries:
    | PostgrestQueryBuilder<any, any>[]
    | PostgrestFilterBuilder<any, any, any>[],
  queryClient: QueryClient
) => {
  let queryKeys: QueryKey[] = [];

  const prefetchPromises = queries.map(async (query) => {
    if (query instanceof PostgrestQueryBuilder) query = query.select();
    const queryMeta = getMetaFromQuery(query);
    const queryKey = getKeyFromMeta(queryMeta);

    // Note: this is why we don't just call prefetchQuery here --> need to save queryKeys in the correct order, so we can return concurrent query results in correct order further below
    queryKeys.push(queryKey);

    const response = await query;
    queryClient.prefetchQuery(queryKey, () => Promise.resolve(response.data));
    return { queryKey, response };
  });

  const queryResponses = await Promise.all(prefetchPromises);

  const orderedQueryResponses = queryKeys.map(
    (queryKey) =>
      queryResponses.find(
        (query) => JSON.stringify(query?.queryKey) == JSON.stringify(queryKey)
      )?.response
  );

  return orderedQueryResponses;
};
