"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invalidateCache = exports.buildSupabaseErrorMessage = exports.getCoupledMutationQueryMeta = exports.getKeyFromMeta = void 0;
const supastruct_1 = require("supastruct");
const getKeyFromMeta = (queryMeta) => {
    let queryKey = [queryMeta.from];
    if (queryMeta.filters)
        queryKey.push(sortObjectKeysAlphabetically(queryMeta.filters)); // note: we order the queryMeta properties alphabetically so that the queryKey hash is consistent
    if (queryMeta.modifiers)
        queryKey.push(sortObjectKeysAlphabetically(queryMeta.modifiers));
    return queryKey;
};
exports.getKeyFromMeta = getKeyFromMeta;
const sortObjectKeysAlphabetically = (obj) => {
    const sortedObj = {};
    Object.keys(obj)
        .sort()
        .forEach((key) => {
        sortedObj[key] = obj[key];
    });
    return sortedObj;
};
/**
 * A coupled mutation must merge the queryMeta from its initial query with its own additional
 * queryMeta before being executed -- `getCoupledMutationQueryMeta` handles this merging.
 */
const getCoupledMutationQueryMeta = (partialMutationQueryMeta, initialQueryMeta) => {
    const { mutation } = partialMutationQueryMeta;
    let mergedQueryMeta;
    let mutationQueryMeta;
    if (typeof mutation == "string") {
        // abstracted mutation (`mutate` option #1):
        // const { mutationOptions } = partialMutationQueryMeta;
        mutationQueryMeta = Object.assign({}, partialMutationQueryMeta);
        // if (mutation != 'delete')
        //   mutationQueryMeta.values = partialMutationQueryMeta.values;
        // if (mutationOptions) mutationQueryMeta.mutationOptions = mutationOptions;
        // TODO: need to manually set some filters depending on mutation:
        //    - "delete" needs to set `eq: [primaryKey, values]`, or using `in` instead of `eq` if values is an array
        //    - "update" needs
        // inject the additional mutation methods/args into the original query:
        mergedQueryMeta = Object.assign(Object.assign({}, initialQueryMeta), partialMutationQueryMeta);
    }
    else {
        // custom mutation (`mutate` option #2):
        mutationQueryMeta = (0, supastruct_1.getMetaFromQuery)(mutation);
        // inject the additional mutation methods/args into the original query:
        mergedQueryMeta = Object.assign(Object.assign(Object.assign({}, initialQueryMeta), mutationQueryMeta), { filters: Object.assign(Object.assign({}, initialQueryMeta.filters), mutationQueryMeta.filters), modifiers: Object.assign(Object.assign({}, initialQueryMeta.modifiers), mutationQueryMeta.modifiers) });
    }
    return { mergedQueryMeta, mutationQueryMeta };
};
exports.getCoupledMutationQueryMeta = getCoupledMutationQueryMeta;
const buildSupabaseErrorMessage = (error) => {
    return `Supabase error. Code: ${error.code}. Details: ${error.details}. Hint: ${error.hint}. Message: ${error.message}.`;
};
exports.buildSupabaseErrorMessage = buildSupabaseErrorMessage;
/**
 * We extract the following cache invalidation logic into a separate function, which we return alongside the useQuery result.
 * This allows users to easily invalidate the cache(s) associated with this particular query/mutation manually (which isn't a
 * frequent need but still useful).
 */
const invalidateCache = (queryClient, queryKey) => {
    console.log("Invalidating cache for key: ", queryKey);
    queryClient.invalidateQueries(queryKey);
    if ((queryKey === null || queryKey === void 0 ? void 0 : queryKey.length) > 1) {
        // eg. if we invalidated ["estimates", {"eq":["id": 1]}], this line ensures we also invalidate the root key of "estimates", so any queries starting with ["estimates", ...] will also get invalidated
        queryClient.invalidateQueries(queryKey[0]);
    }
};
exports.invalidateCache = invalidateCache;
