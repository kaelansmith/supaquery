import { SupabaseRecord } from "supastruct";
import { OptimisticMutateCacheProps } from "./types";

export const optimisticallyMutateCache = async ({
  mutationQueryMeta,
  queryKey,
  queryClient,
  primaryKey,
}: OptimisticMutateCacheProps) => {
  const { mutation } = mutationQueryMeta;
  const isCustomMutation = typeof mutation != "string";

  let newData = mutation != "delete" ? mutationQueryMeta.values : null;

  // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
  await queryClient.cancelQueries(queryKey);

  // Snapshot the previous data
  const previousData = queryClient.getQueryData(queryKey);

  // Optimistically update the query's cached data
  queryClient.setQueryData(
    queryKey,
    (oldData: SupabaseRecord | SupabaseRecord[]) => {
      const updatedData = (() => {
        if (isCustomMutation) {
          // TODO: write optimistic update logic for `mutate` option #2, using mutationQueryMeta's filters (if any) to determine which cached row(s) matches the new row(s)
          // ...
        } else {
          const isBulkMutation = Array.isArray(newData);
          const isOldDataArray = Array.isArray(oldData);

          console.log("OPTIMISTIC UPDATE:", {
            queryKey,
            mutationQueryMeta,
            newData,
            oldData: isOldDataArray ? [...oldData] : { ...oldData },
          });

          if (mutation == "update" || mutation == "upsert") {
            if (!newData) {
              console.error(
                `You're trying to run an ${mutation} mutation, but didn't provide any data.`
              );
              return oldData;
            }

            if (isOldDataArray) {
              let updatedOldData;

              if (isBulkMutation) {
                let matchingNewRowIDs: any[] = [];

                updatedOldData = oldData.map((oldRow) => {
                  let matchingNewRow = (newData as SupabaseRecord[]).find(
                    (newRow) => newRow[primaryKey] == oldRow[primaryKey]
                  );

                  if (matchingNewRow) {
                    // we keep track of newRows that match oldRows, so we can later insert brand new rows if mutation == 'upsert'
                    matchingNewRowIDs.push(matchingNewRow[primaryKey]);

                    // merge new row into old and return it:
                    return { ...oldRow, ...matchingNewRow };
                  }

                  // none of the new rows match this old one, so return it as-is:
                  return oldRow;
                });

                if (mutation == "upsert") {
                  // "upsert" is the same as "update" except we insert rows that previously didn't exist on top of updating existing rows, which we do here:
                  let brandNewRows = (newData as SupabaseRecord[]).filter(
                    (row) => !matchingNewRowIDs.includes(row[primaryKey])
                  );
                  if (brandNewRows && brandNewRows.length)
                    return [...updatedOldData, ...brandNewRows]; // TODO: properly handle sorting to prevent UI flickers when real data replaces this optimistic data
                }

                return updatedOldData;
              } else {
                // we're updating a single object within an array of cached objects (i.e. non-bulk update):
                let updatedExisting = false;

                // check if the query used the `eq` method with a primaryKey column, and extract the PK value if so:
                let idOfRowToUpdate: any = (newData as SupabaseRecord)[
                  primaryKey
                ];

                if (mutation == "update" && !idOfRowToUpdate) {
                  console.error(
                    `You're trying to "update" an object that is missing the primary key field "${primaryKey}". Either provide the PK field in the updated data, or if it's a new record use the "upsert" method instead; or perhaps you need to supply a different "primaryKey" value to useQuery()'s options argument.`
                  );
                  return oldData; // couldn't perform optimistic update (edge case)
                }

                if (idOfRowToUpdate) {
                  updatedOldData = oldData.map((oldRow) => {
                    if (oldRow[primaryKey] == idOfRowToUpdate) {
                      updatedExisting = true;
                      return { ...oldRow, ...newData };
                    }
                    return oldRow;
                  });
                }

                if (mutation == "upsert" && !updatedExisting) {
                  // "upsert" is the same as "update" except we insert the new row if it doesn't already exist, which we do here:
                  return [...oldData, newData];
                }

                return updatedOldData ?? oldData;
              }
            } else {
              // old/cached data is a single object, which simplifies our optimistic update:
              if (!isBulkMutation) return { ...oldData, ...newData };
              return newData;
            }
          } else if (mutation == "insert") {
            // Note: we're optimistically adding the newly inserted row in a fake way (in order for it to feel faster to user), because we don't have its id yet as we haven't waited for a response from the DB.. when onSettled() runs, this fake data will get replaced with the real data from the database, but this won't be noticeable to the user
            if (!isBulkMutation) newData = [newData];
            let insertData = newData as SupabaseRecord[]; // type assertion to make TS happy
            // TODO: don't assume user has a "created_at" field -- and provide way to specify custom fields to include here?
            insertData.forEach((row: SupabaseRecord) => ({
              created_at: new Date(),
              ...row,
            }));
            if (isOldDataArray) return [...oldData, ...insertData];
            else return insertData[0];
          } else if (mutation == "delete") {
            const { filters } = mutationQueryMeta;
            if (filters) {
              const ids =
                mutationQueryMeta.filters?.eq?.[1] ??
                mutationQueryMeta.filters?.in?.[1] ??
                null;
              const isBulkDelete = Array.isArray(ids);
              if (isOldDataArray) {
                if (isBulkDelete)
                  return oldData.filter(
                    (row) => row && !ids.includes(row?.[primaryKey])
                  );
                return oldData.filter((row) => row && row?.[primaryKey] != ids);
              } else return null;
            } else {
              // when no filters provided, we delete ALL records in this query cache:
              return null;
            }
          }
        }
      })();

      console.log("OPTIMISTIC UPDATE - final data: ", updatedData);
      return updatedData;
    }
  ); // === END queryClient.setQueryData() ===

  // Return a context object with the snapshotted previous-state value (in case the DB operation fails, we can roll back to this data snapshot -- see onError())
  return { previousData };
};
