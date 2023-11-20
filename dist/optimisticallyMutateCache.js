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
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimisticallyMutateCache = void 0;
const helpers_1 = require("./helpers");
const optimisticallyMutateCache = ({ partialMutationQueryMeta, queryMeta, queryKey, queryClient, primaryKey, }) => __awaiter(void 0, void 0, void 0, function* () {
    const { mutationQueryMeta } = (0, helpers_1.getCoupledMutationQueryMeta)(partialMutationQueryMeta, queryMeta);
    // const { mutation } = partialMutationQueryMeta;
    const { mutation } = mutationQueryMeta;
    const isCustomMutation = typeof mutation != "string";
    let newData = mutation != "delete" ? mutationQueryMeta.values : null;
    // globalMutationOptions?.onMutate?.(partialMutationQueryMeta); // call user-provided custom onMutate
    // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
    yield queryClient.cancelQueries(queryKey);
    // Snapshot the previous data
    const previousData = queryClient.getQueryData(queryKey);
    // Optimistically update the query's cached data
    queryClient.setQueryData(queryKey, (oldData) => {
        const updatedData = (() => {
            var _a, _b, _c, _d, _e, _f;
            if (isCustomMutation) {
                // TODO: write optimistic update logic for `mutate` option #2, using mutationQueryMeta's filters (if any) to determine which cached row(s) matches the new row(s)
                // ...
            }
            else {
                const isBulkMutation = Array.isArray(newData);
                const isOldDataArray = Array.isArray(oldData);
                console.log("OPTIMISTIC UPDATE:", {
                    queryKey,
                    queryMeta,
                    mutationQueryMeta,
                    newData,
                    oldData: isOldDataArray ? [...oldData] : Object.assign({}, oldData),
                });
                if (mutation == "update" || mutation == "upsert") {
                    if (!newData) {
                        console.error(`You're trying to run an ${mutation} mutation, but didn't provide any data.`);
                        return oldData;
                    }
                    if (isOldDataArray) {
                        let updatedOldData;
                        if (isBulkMutation) {
                            let matchingNewRowIDs = [];
                            updatedOldData = oldData.map((oldRow) => {
                                let matchingNewRow = newData.find((newRow) => newRow[primaryKey] == oldRow[primaryKey]);
                                if (matchingNewRow) {
                                    // we keep track of newRows that match oldRows, so we can later insert brand new rows if mutation == 'upsert'
                                    matchingNewRowIDs.push(matchingNewRow[primaryKey]);
                                    // merge new row into old and return it:
                                    return Object.assign(Object.assign({}, oldRow), matchingNewRow);
                                }
                                // none of the new rows match this old one, so return it as-is:
                                return oldRow;
                            });
                            if (mutation == "upsert") {
                                // "upsert" is the same as "update" except we insert rows that previously didn't exist on top of updating existing rows, which we do here:
                                let brandNewRows = newData.filter((row) => !matchingNewRowIDs.includes(row[primaryKey]));
                                if (brandNewRows && brandNewRows.length)
                                    return [...updatedOldData, ...brandNewRows]; // TODO: properly handle sorting to prevent UI flickers when real data replaces this optimistic data
                            }
                            return updatedOldData;
                        }
                        else {
                            // we're updating a single object within an array of cached objects (i.e. non-bulk update):
                            let updatedExisting = false;
                            // check if the query used the `eq` method with a primaryKey column, and extract the PK value if so:
                            let idOfRowToUpdate = newData[primaryKey];
                            // if (queryMeta.filters)
                            if (mutation == "update" && !idOfRowToUpdate) {
                                console.error(`You're trying to "update" an object that is missing the primary key field "${primaryKey}". Either provide the PK field in the updated data, or if it's a new record use the "upsert" method instead; or perhaps you need to supply a different "primaryKey" value to useQuery()'s options argument.`);
                                return oldData; // couldn't perform optimistic update (edge case)
                            }
                            if (idOfRowToUpdate) {
                                updatedOldData = oldData.map((oldRow) => {
                                    if (oldRow[primaryKey] == idOfRowToUpdate) {
                                        updatedExisting = true;
                                        return Object.assign(Object.assign({}, oldRow), newData);
                                    }
                                    return oldRow;
                                });
                            }
                            if (mutation == "upsert" && !updatedExisting) {
                                // "upsert" is the same as "update" except we insert the new row if it doesn't already exist, which we do here:
                                return [...oldData, newData];
                            }
                            return updatedOldData !== null && updatedOldData !== void 0 ? updatedOldData : oldData;
                        }
                    }
                    else {
                        // old/cached data is a single object, which simplifies our optimistic update:
                        if (!isBulkMutation)
                            return Object.assign(Object.assign({}, oldData), newData);
                        return newData;
                    }
                }
                else if (mutation == "insert") {
                    // Note: we're optimistically adding the newly inserted row in a fake way (in order for it to feel faster to user), because we don't have its id yet as we haven't waited for a response from the DB.. when onSettled() runs, this fake data will get replaced with the real data from the database, but this won't be noticeable to the user
                    if (!isBulkMutation)
                        newData = [newData];
                    let insertData = newData; // type assertion to make TS happy
                    // TODO: don't assume user has a "created_at" field -- and provide way to specify custom fields to include here?
                    insertData.forEach((row) => (Object.assign({ created_at: new Date() }, row)));
                    if (isOldDataArray)
                        return [...oldData, ...insertData];
                    else
                        return insertData[0];
                }
                else if (mutation == "delete") {
                    const { filters } = mutationQueryMeta;
                    if (filters) {
                        const ids = (_f = (_c = (_b = (_a = mutationQueryMeta.filters) === null || _a === void 0 ? void 0 : _a.eq) === null || _b === void 0 ? void 0 : _b[1]) !== null && _c !== void 0 ? _c : (_e = (_d = mutationQueryMeta.filters) === null || _d === void 0 ? void 0 : _d.in) === null || _e === void 0 ? void 0 : _e[1]) !== null && _f !== void 0 ? _f : null;
                        const isBulkDelete = Array.isArray(ids);
                        if (isOldDataArray) {
                            if (isBulkDelete)
                                return oldData.filter((row) => row && !ids.includes(row === null || row === void 0 ? void 0 : row[primaryKey]));
                            return oldData.filter((row) => row && (row === null || row === void 0 ? void 0 : row[primaryKey]) != ids);
                        }
                        else
                            return null;
                    }
                    else {
                        // when no filters provided, we delete ALL records in this query cache:
                        return null;
                    }
                }
            }
        })();
        console.log("OPTIMISTIC UPDATE - final data: ", updatedData);
        return updatedData;
    }); // === END queryClient.setQueryData() ===
    // Return a context object with the snapshotted previous-state value (in case the DB operation fails, we can roll back to this data snapshot -- see onError())
    return { previousData };
});
exports.optimisticallyMutateCache = optimisticallyMutateCache;
