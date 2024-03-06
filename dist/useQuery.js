"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useQuery = void 0;
const react_query_1 = require("react-query");
const postgrest_js_1 = require("@supabase/postgrest-js");
const supastruct_1 = require("supastruct");
const supastruct_2 = require("supastruct");
const helpers_1 = require("./helpers");
const optimisticallyMutateCache_1 = require("./optimisticallyMutateCache");
const mutateWrapper_1 = require("./mutateWrapper");
function useQuery(query, options) {
    var _a;
    const { primaryKey = "id", queryOptions, unallowedIds: userUnallowedIds = [], } = options !== null && options !== void 0 ? options : {};
    if (query instanceof postgrest_js_1.PostgrestQueryBuilder)
        query = query.select(); // this line allows people to not have to always specify `select()` if it's a generic table-wide select.. we add it for them, so they can just write `db.from("todos")`
    const finalQuery = query; // `finalQuery` only exists for type assertion
    const queryMeta = (0, supastruct_2.getMetaFromQuery)(finalQuery);
    const queryKey = (0, helpers_1.getKeyFromMeta)(queryMeta);
    // check if the query is filtering on an unallowed primaryKey value, in which case we override query result with `data: null` at the end
    let returnNullData = false;
    const unallowedIds = ["new", false, true, ...userUnallowedIds];
    const { eq } = (_a = queryMeta.filters) !== null && _a !== void 0 ? _a : {};
    if (eq &&
        typeof eq[0] == "string" &&
        eq[0] == primaryKey &&
        unallowedIds.includes(eq[1])) {
        returnNullData = true;
    }
    const queryResponse = (0, react_query_1.useQuery)(queryKey, () => __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield finalQuery;
        if (error)
            throw (0, helpers_1.buildSupabaseErrorMessage)(error);
        return data;
    }), Object.assign({ enabled: returnNullData != true }, queryOptions));
    // ========================
    // Set up coupled mutation:
    // ========================
    const supabaseProxyClient = finalQuery.getProxyClient();
    const supabaseClient = finalQuery.getSupabaseClient();
    const queryClient = (0, react_query_1.useQueryClient)();
    supabaseProxyClient.addQueryMeta({ usingSupaquery: true }); // helps other Supastruct query abstractions conditionally handle Supaquery-wrapped queries differently
    const _b = (0, react_query_1.useMutation)((partialMutationQueryMeta) => __awaiter(this, void 0, void 0, function* () {
        const { mergedQueryMeta } = (0, helpers_1.getCoupledMutationQueryMeta)(partialMutationQueryMeta, queryMeta);
        // execute the mutation using the same proxyClient used by the original query:
        const { data, error } = yield (0, supastruct_1.supastruct)(supabaseProxyClient, mergedQueryMeta);
        if (error)
            throw (0, helpers_1.buildSupabaseErrorMessage)(error); // triggers `onError` callback
        return data; // gets passed to `onSuccess` and `onSettled` as 1st arg
    }), {
        // The following methods enable Optimistic Updates (see: https://react-query.tanstack.com/guides/optimistic-updates)
        /**
         * onMutate() will fire before the above mutation function is fired and is passed the same variables it receives.
         * We use it to optimistically update the locally cached records from the original query in the hopes that the mutation
         * succeeds, resulting in very snappy UI updates since we don't wait for the DB response before re-rendering the mutated
         * data. See `onError` (below) to see how we roll back failed mutations, and `onSettled` (below) to see how we always
         * invalidate the cache to force a refetch (which will essentially override the optimistic update with the real data
         * a second later -- that small amount of gained time still makes a substantial UI/UX difference).
         */
        onMutate: (partialMutationQueryMeta) => __awaiter(this, void 0, void 0, function* () {
            const { mutationQueryMeta } = (0, helpers_1.getCoupledMutationQueryMeta)(partialMutationQueryMeta, queryMeta);
            const { previousData } = yield (0, optimisticallyMutateCache_1.optimisticallyMutateCache)({
                mutationQueryMeta,
                queryKey,
                queryClient,
                primaryKey,
            });
            return { previousData };
        }),
        // If the mutation fails, use the context returned from onMutate to roll back to previous state from before the optimistic update
        onError: (err, partialMutationQueryMeta, context) => {
            // globalMutationOptions?.onError?.(err, newData, context); // call user-provided custom onError
            console.error(`Failed to run "${partialMutationQueryMeta.mutation}" coupled mutation for query with key of "${queryKey}". Error: ${err}`);
            const { previousData } = context !== null && context !== void 0 ? context : {};
            if (previousData)
                queryClient.setQueryData(queryKey, previousData);
        },
        // onSuccess: () => {
        // globalMutationOptions?.onSuccess?.(props); // call user-provided custom onSuccess
        // },
        onSettled: (data) => {
            // globalMutationOptions?.onSettled?.(props); // call user-provided custom onSettled
            console.log("onSettled result: ", data);
            // Always refetch after error or success:
            (0, helpers_1.invalidateCache)(queryClient, queryKey);
        },
    }), { mutate, mutateAsync } = _b, rest = __rest(_b, ["mutate", "mutateAsync"]);
    const mutateWrapperOptions = {
        primaryKey,
        supabaseClient,
        queryMeta,
    };
    const result = Object.assign(Object.assign({ queryKey,
        queryMeta }, (returnNullData
        ? {
            data: null,
            error: null,
            isError: false,
            isFetching: false,
            isFetched: true,
            isIdle: false,
            isLoading: false,
            isLoadingError: false,
        }
        : queryResponse)), { mutate: (mutateCallbacks) => (0, mutateWrapper_1.mutateWrapper)((variables) => mutate(variables, mutateCallbacks), mutateWrapperOptions), mutateAsync: (mutateCallbacks) => (0, mutateWrapper_1.mutateWrapper)((variables) => mutateAsync(variables, mutateCallbacks), mutateWrapperOptions), mutationState: Object.assign({}, rest), invalidateCache: () => (0, helpers_1.invalidateCache)(queryClient, queryKey) });
    return result;
}
exports.useQuery = useQuery;
