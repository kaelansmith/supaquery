import { InsertMutationOptions, MutationCountOption, SupabaseRecord, UpsertMutationOptions } from "supastruct";
import { CustomMutationGetter, MutateFunction, MutateWrapperOptions } from "./types";
export declare const mutateWrapper: (mutateFn: MutateFunction, options: MutateWrapperOptions) => {
    update: (values: SupabaseRecord, mutationOptions?: MutationCountOption) => void;
    insert: (values: SupabaseRecord | SupabaseRecord[], mutationOptions?: InsertMutationOptions) => void | Promise<any>;
    upsert: (values: SupabaseRecord | SupabaseRecord[], mutationOptions?: UpsertMutationOptions) => void | Promise<any>;
    delete: (ids?: number | string | number[] | string[], mutationOptions?: MutationCountOption) => void;
    custom: (getCustomMutation: CustomMutationGetter) => void;
};
