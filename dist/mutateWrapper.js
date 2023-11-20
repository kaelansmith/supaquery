"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mutateWrapper = void 0;
const supastruct_1 = require("supastruct");
const supastruct_2 = require("supastruct");
const mutateWrapper = (mutateFn, options) => {
    const { primaryKey, supabaseClient, queryMeta } = options;
    const update = (values, mutationOptions) => {
        mutateFn({
            mutation: "update",
            values,
            mutationOptions,
        });
    };
    const insert = (values, mutationOptions) => mutateFn({
        mutation: "insert",
        values,
        mutationOptions,
    });
    const upsert = (values, mutationOptions) => mutateFn({
        mutation: "upsert",
        values,
        mutationOptions,
    });
    // Note: `delete` is a reserved keyword hence `deleteFn` below (but it gets exposed as `delete`)
    /**
     * @param ids optional -- a single record ID (primary key value) to delete, or an array of IDs; if nothing is provided, all records from the initial query will be deleted (be careful about that)
     */
    const deleteFn = (ids, mutationOptions) => {
        let deleteQueryMeta = {
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
    const custom = (getCustomMutation) => {
        const client = (0, supastruct_1.createSupastructClient)(supabaseClient);
        const mutation = getCustomMutation(client.from(queryMeta.from)); // user builds upon this queryBuilder and returns a filterBuilder
        const mutationQueryMeta = (0, supastruct_2.getMetaFromQuery)(mutation);
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
exports.mutateWrapper = mutateWrapper;
