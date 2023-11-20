import {
  InsertMutationOptions,
  MutationCountOption,
  QueryMeta,
  SupabaseRecord,
  UpsertMutationOptions,
} from "supastruct";
import {
  CustomMutationGetter,
  MutateFunction,
  MutateWrapperOptions,
} from "./types";
import { createSupastructClient } from "supastruct";
import { getMetaFromQuery } from "supastruct";

export const mutateWrapper = (
  mutateFn: MutateFunction,
  options: MutateWrapperOptions
) => {
  const { primaryKey, supabaseClient, queryMeta } = options;
  const update = (
    values: SupabaseRecord,
    mutationOptions?: MutationCountOption
  ) => {
    mutateFn({
      mutation: "update",
      values,
      mutationOptions,
    });
  };

  const insert = (
    values: SupabaseRecord | SupabaseRecord[],
    mutationOptions?: InsertMutationOptions
  ) =>
    mutateFn({
      mutation: "insert",
      values,
      mutationOptions,
    });

  const upsert = (
    values: SupabaseRecord | SupabaseRecord[],
    mutationOptions?: UpsertMutationOptions
  ) =>
    mutateFn({
      mutation: "upsert",
      values,
      mutationOptions,
    });

  // Note: `delete` is a reserved keyword hence `deleteFn` below (but it gets exposed as `delete`)
  /**
   * @param ids optional -- a single record ID (primary key value) to delete, or an array of IDs; if nothing is provided, all records from the initial query will be deleted (be careful about that)
   */
  const deleteFn = (
    ids?: number | string | number[] | string[],
    mutationOptions?: MutationCountOption
  ) => {
    let deleteQueryMeta: Partial<QueryMeta> = {
      mutation: "delete",
      mutationOptions,
    };

    if (ids) {
      const method = Array.isArray(ids) ? "in" : "eq";
      deleteQueryMeta.filters = {
        [method]: [primaryKey, ids],
      };
    }

    mutateFn(deleteQueryMeta);
  };

  const custom = (getCustomMutation: CustomMutationGetter) => {
    const client = createSupastructClient(supabaseClient);
    const mutation = getCustomMutation(client.from(queryMeta.from)); // user builds upon this queryBuilder and returns a filterBuilder
    const mutationQueryMeta = getMetaFromQuery(mutation);
    mutateFn(mutationQueryMeta);
  };

  return {
    update,
    insert,
    upsert,
    delete: deleteFn,
    custom,
  };
};
