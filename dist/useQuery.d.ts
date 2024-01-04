import { PostgrestQueryBuilder, PostgrestFilterBuilder, PostgrestBuilder } from "@supabase/postgrest-js";
import type { QueryMeta } from "supastruct";
import type { CoupledMutateCallbacks, UseQueryOptions } from "./types";
export declare function useQuery(query: PostgrestQueryBuilder<any, any> | PostgrestFilterBuilder<any, any, any> | PostgrestBuilder<any>, options?: UseQueryOptions): {
    mutate: (mutateCallbacks?: CoupledMutateCallbacks) => {
        update: (values: import("supastruct").SupabaseRecord, mutationOptions?: import("supastruct").MutationCountOption) => void;
        insert: (values: import("supastruct").SupabaseRecord | import("supastruct").SupabaseRecord[], mutationOptions?: import("supastruct").InsertMutationOptions) => void | Promise<any>;
        upsert: (values: import("supastruct").SupabaseRecord | import("supastruct").SupabaseRecord[], mutationOptions?: import("supastruct").UpsertMutationOptions) => void | Promise<any>;
        delete: (ids?: string | number | number[] | string[], mutationOptions?: import("supastruct").MutationCountOption) => void;
        custom: (getCustomMutation: import("./types").CustomMutationGetter) => void;
    };
    mutateAsync: (mutateCallbacks?: CoupledMutateCallbacks) => {
        update: (values: import("supastruct").SupabaseRecord, mutationOptions?: import("supastruct").MutationCountOption) => void;
        insert: (values: import("supastruct").SupabaseRecord | import("supastruct").SupabaseRecord[], mutationOptions?: import("supastruct").InsertMutationOptions) => void | Promise<any>;
        upsert: (values: import("supastruct").SupabaseRecord | import("supastruct").SupabaseRecord[], mutationOptions?: import("supastruct").UpsertMutationOptions) => void | Promise<any>;
        delete: (ids?: string | number | number[] | string[], mutationOptions?: import("supastruct").MutationCountOption) => void;
        custom: (getCustomMutation: import("./types").CustomMutationGetter) => void;
    };
    mutationState: {
        data: undefined;
        error: null;
        isError: false;
        isIdle: true;
        isLoading: false;
        isSuccess: false;
        status: "idle";
        reset: () => void;
        context: {
            previousData: unknown;
        };
        failureCount: number;
        isPaused: boolean;
        variables: Partial<QueryMeta>;
    } | {
        data: undefined;
        error: null;
        isError: false;
        isIdle: false;
        isLoading: true;
        isSuccess: false;
        status: "loading";
        reset: () => void;
        context: {
            previousData: unknown;
        };
        failureCount: number;
        isPaused: boolean;
        variables: Partial<QueryMeta>;
    } | {
        data: undefined;
        error: unknown;
        isError: true;
        isIdle: false;
        isLoading: false;
        isSuccess: false;
        status: "error";
        reset: () => void;
        context: {
            previousData: unknown;
        };
        failureCount: number;
        isPaused: boolean;
        variables: Partial<QueryMeta>;
    } | {
        data: any;
        error: null;
        isError: false;
        isIdle: false;
        isLoading: false;
        isSuccess: true;
        status: "success";
        reset: () => void;
        context: {
            previousData: unknown;
        };
        failureCount: number;
        isPaused: boolean;
        variables: Partial<QueryMeta>;
    };
    invalidateCache: () => void;
    data: undefined;
    error: null;
    isError: false;
    isIdle: true;
    isLoading: false;
    isLoadingError: false;
    isRefetchError: false;
    isSuccess: false;
    status: "idle";
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isPlaceholderData: boolean;
    isPreviousData: boolean;
    isRefetching: boolean;
    isStale: boolean;
    refetch: <TPageData>(options?: import("react-query").RefetchOptions & import("react-query").RefetchQueryFilters<TPageData>) => Promise<import("react-query").QueryObserverResult<unknown, unknown>>;
    remove: () => void;
    queryKey: import("./types").QueryKey;
    queryMeta: QueryMeta;
} | {
    mutate: (mutateCallbacks?: CoupledMutateCallbacks) => {
        update: (values: import("supastruct").SupabaseRecord, mutationOptions?: import("supastruct").MutationCountOption) => void;
        insert: (values: import("supastruct").SupabaseRecord | import("supastruct").SupabaseRecord[], mutationOptions?: import("supastruct").InsertMutationOptions) => void | Promise<any>;
        upsert: (values: import("supastruct").SupabaseRecord | import("supastruct").SupabaseRecord[], mutationOptions?: import("supastruct").UpsertMutationOptions) => void | Promise<any>;
        delete: (ids?: string | number | number[] | string[], mutationOptions?: import("supastruct").MutationCountOption) => void;
        custom: (getCustomMutation: import("./types").CustomMutationGetter) => void;
    };
    mutateAsync: (mutateCallbacks?: CoupledMutateCallbacks) => {
        update: (values: import("supastruct").SupabaseRecord, mutationOptions?: import("supastruct").MutationCountOption) => void;
        insert: (values: import("supastruct").SupabaseRecord | import("supastruct").SupabaseRecord[], mutationOptions?: import("supastruct").InsertMutationOptions) => void | Promise<any>;
        upsert: (values: import("supastruct").SupabaseRecord | import("supastruct").SupabaseRecord[], mutationOptions?: import("supastruct").UpsertMutationOptions) => void | Promise<any>;
        delete: (ids?: string | number | number[] | string[], mutationOptions?: import("supastruct").MutationCountOption) => void;
        custom: (getCustomMutation: import("./types").CustomMutationGetter) => void;
    };
    mutationState: {
        data: undefined;
        error: null;
        isError: false;
        isIdle: true;
        isLoading: false;
        isSuccess: false;
        status: "idle";
        reset: () => void;
        context: {
            previousData: unknown;
        };
        failureCount: number;
        isPaused: boolean;
        variables: Partial<QueryMeta>;
    } | {
        data: undefined;
        error: null;
        isError: false;
        isIdle: false;
        isLoading: true;
        isSuccess: false;
        status: "loading";
        reset: () => void;
        context: {
            previousData: unknown;
        };
        failureCount: number;
        isPaused: boolean;
        variables: Partial<QueryMeta>;
    } | {
        data: undefined;
        error: unknown;
        isError: true;
        isIdle: false;
        isLoading: false;
        isSuccess: false;
        status: "error";
        reset: () => void;
        context: {
            previousData: unknown;
        };
        failureCount: number;
        isPaused: boolean;
        variables: Partial<QueryMeta>;
    } | {
        data: any;
        error: null;
        isError: false;
        isIdle: false;
        isLoading: false;
        isSuccess: true;
        status: "success";
        reset: () => void;
        context: {
            previousData: unknown;
        };
        failureCount: number;
        isPaused: boolean;
        variables: Partial<QueryMeta>;
    };
    invalidateCache: () => void;
    data: undefined;
    error: unknown;
    isError: true;
    isIdle: false;
    isLoading: false;
    isLoadingError: true;
    isRefetchError: false;
    isSuccess: false;
    status: "error";
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isPlaceholderData: boolean;
    isPreviousData: boolean;
    isRefetching: boolean;
    isStale: boolean;
    refetch: <TPageData>(options?: import("react-query").RefetchOptions & import("react-query").RefetchQueryFilters<TPageData>) => Promise<import("react-query").QueryObserverResult<unknown, unknown>>;
    remove: () => void;
    queryKey: import("./types").QueryKey;
    queryMeta: QueryMeta;
} | {
    mutate: (mutateCallbacks?: CoupledMutateCallbacks) => {
        update: (values: import("supastruct").SupabaseRecord, mutationOptions?: import("supastruct").MutationCountOption) => void;
        insert: (values: import("supastruct").SupabaseRecord | import("supastruct").SupabaseRecord[], mutationOptions?: import("supastruct").InsertMutationOptions) => void | Promise<any>;
        upsert: (values: import("supastruct").SupabaseRecord | import("supastruct").SupabaseRecord[], mutationOptions?: import("supastruct").UpsertMutationOptions) => void | Promise<any>;
        delete: (ids?: string | number | number[] | string[], mutationOptions?: import("supastruct").MutationCountOption) => void;
        custom: (getCustomMutation: import("./types").CustomMutationGetter) => void;
    };
    mutateAsync: (mutateCallbacks?: CoupledMutateCallbacks) => {
        update: (values: import("supastruct").SupabaseRecord, mutationOptions?: import("supastruct").MutationCountOption) => void;
        insert: (values: import("supastruct").SupabaseRecord | import("supastruct").SupabaseRecord[], mutationOptions?: import("supastruct").InsertMutationOptions) => void | Promise<any>;
        upsert: (values: import("supastruct").SupabaseRecord | import("supastruct").SupabaseRecord[], mutationOptions?: import("supastruct").UpsertMutationOptions) => void | Promise<any>;
        delete: (ids?: string | number | number[] | string[], mutationOptions?: import("supastruct").MutationCountOption) => void;
        custom: (getCustomMutation: import("./types").CustomMutationGetter) => void;
    };
    mutationState: {
        data: undefined;
        error: null;
        isError: false;
        isIdle: true;
        isLoading: false;
        isSuccess: false;
        status: "idle";
        reset: () => void;
        context: {
            previousData: unknown;
        };
        failureCount: number;
        isPaused: boolean;
        variables: Partial<QueryMeta>;
    } | {
        data: undefined;
        error: null;
        isError: false;
        isIdle: false;
        isLoading: true;
        isSuccess: false;
        status: "loading";
        reset: () => void;
        context: {
            previousData: unknown;
        };
        failureCount: number;
        isPaused: boolean;
        variables: Partial<QueryMeta>;
    } | {
        data: undefined;
        error: unknown;
        isError: true;
        isIdle: false;
        isLoading: false;
        isSuccess: false;
        status: "error";
        reset: () => void;
        context: {
            previousData: unknown;
        };
        failureCount: number;
        isPaused: boolean;
        variables: Partial<QueryMeta>;
    } | {
        data: any;
        error: null;
        isError: false;
        isIdle: false;
        isLoading: false;
        isSuccess: true;
        status: "success";
        reset: () => void;
        context: {
            previousData: unknown;
        };
        failureCount: number;
        isPaused: boolean;
        variables: Partial<QueryMeta>;
    };
    invalidateCache: () => void;
    data: undefined;
    error: null;
    isError: false;
    isIdle: false;
    isLoading: true;
    isLoadingError: false;
    isRefetchError: false;
    isSuccess: false;
    status: "loading";
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isPlaceholderData: boolean;
    isPreviousData: boolean;
    isRefetching: boolean;
    isStale: boolean;
    refetch: <TPageData>(options?: import("react-query").RefetchOptions & import("react-query").RefetchQueryFilters<TPageData>) => Promise<import("react-query").QueryObserverResult<unknown, unknown>>;
    remove: () => void;
    queryKey: import("./types").QueryKey;
    queryMeta: QueryMeta;
} | {
    mutate: (mutateCallbacks?: CoupledMutateCallbacks) => {
        update: (values: import("supastruct").SupabaseRecord, mutationOptions?: import("supastruct").MutationCountOption) => void;
        insert: (values: import("supastruct").SupabaseRecord | import("supastruct").SupabaseRecord[], mutationOptions?: import("supastruct").InsertMutationOptions) => void | Promise<any>;
        upsert: (values: import("supastruct").SupabaseRecord | import("supastruct").SupabaseRecord[], mutationOptions?: import("supastruct").UpsertMutationOptions) => void | Promise<any>;
        delete: (ids?: string | number | number[] | string[], mutationOptions?: import("supastruct").MutationCountOption) => void;
        custom: (getCustomMutation: import("./types").CustomMutationGetter) => void;
    };
    mutateAsync: (mutateCallbacks?: CoupledMutateCallbacks) => {
        update: (values: import("supastruct").SupabaseRecord, mutationOptions?: import("supastruct").MutationCountOption) => void;
        insert: (values: import("supastruct").SupabaseRecord | import("supastruct").SupabaseRecord[], mutationOptions?: import("supastruct").InsertMutationOptions) => void | Promise<any>;
        upsert: (values: import("supastruct").SupabaseRecord | import("supastruct").SupabaseRecord[], mutationOptions?: import("supastruct").UpsertMutationOptions) => void | Promise<any>;
        delete: (ids?: string | number | number[] | string[], mutationOptions?: import("supastruct").MutationCountOption) => void;
        custom: (getCustomMutation: import("./types").CustomMutationGetter) => void;
    };
    mutationState: {
        data: undefined;
        error: null;
        isError: false;
        isIdle: true;
        isLoading: false;
        isSuccess: false;
        status: "idle";
        reset: () => void;
        context: {
            previousData: unknown;
        };
        failureCount: number;
        isPaused: boolean;
        variables: Partial<QueryMeta>;
    } | {
        data: undefined;
        error: null;
        isError: false;
        isIdle: false;
        isLoading: true;
        isSuccess: false;
        status: "loading";
        reset: () => void;
        context: {
            previousData: unknown;
        };
        failureCount: number;
        isPaused: boolean;
        variables: Partial<QueryMeta>;
    } | {
        data: undefined;
        error: unknown;
        isError: true;
        isIdle: false;
        isLoading: false;
        isSuccess: false;
        status: "error";
        reset: () => void;
        context: {
            previousData: unknown;
        };
        failureCount: number;
        isPaused: boolean;
        variables: Partial<QueryMeta>;
    } | {
        data: any;
        error: null;
        isError: false;
        isIdle: false;
        isLoading: false;
        isSuccess: true;
        status: "success";
        reset: () => void;
        context: {
            previousData: unknown;
        };
        failureCount: number;
        isPaused: boolean;
        variables: Partial<QueryMeta>;
    };
    invalidateCache: () => void;
    data: unknown;
    error: unknown;
    isError: true;
    isIdle: false;
    isLoading: false;
    isLoadingError: false;
    isRefetchError: true;
    isSuccess: false;
    status: "error";
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isPlaceholderData: boolean;
    isPreviousData: boolean;
    isRefetching: boolean;
    isStale: boolean;
    refetch: <TPageData>(options?: import("react-query").RefetchOptions & import("react-query").RefetchQueryFilters<TPageData>) => Promise<import("react-query").QueryObserverResult<unknown, unknown>>;
    remove: () => void;
    queryKey: import("./types").QueryKey;
    queryMeta: QueryMeta;
} | {
    mutate: (mutateCallbacks?: CoupledMutateCallbacks) => {
        update: (values: import("supastruct").SupabaseRecord, mutationOptions?: import("supastruct").MutationCountOption) => void;
        insert: (values: import("supastruct").SupabaseRecord | import("supastruct").SupabaseRecord[], mutationOptions?: import("supastruct").InsertMutationOptions) => void | Promise<any>;
        upsert: (values: import("supastruct").SupabaseRecord | import("supastruct").SupabaseRecord[], mutationOptions?: import("supastruct").UpsertMutationOptions) => void | Promise<any>;
        delete: (ids?: string | number | number[] | string[], mutationOptions?: import("supastruct").MutationCountOption) => void;
        custom: (getCustomMutation: import("./types").CustomMutationGetter) => void;
    };
    mutateAsync: (mutateCallbacks?: CoupledMutateCallbacks) => {
        update: (values: import("supastruct").SupabaseRecord, mutationOptions?: import("supastruct").MutationCountOption) => void;
        insert: (values: import("supastruct").SupabaseRecord | import("supastruct").SupabaseRecord[], mutationOptions?: import("supastruct").InsertMutationOptions) => void | Promise<any>;
        upsert: (values: import("supastruct").SupabaseRecord | import("supastruct").SupabaseRecord[], mutationOptions?: import("supastruct").UpsertMutationOptions) => void | Promise<any>;
        delete: (ids?: string | number | number[] | string[], mutationOptions?: import("supastruct").MutationCountOption) => void;
        custom: (getCustomMutation: import("./types").CustomMutationGetter) => void;
    };
    mutationState: {
        data: undefined;
        error: null;
        isError: false;
        isIdle: true;
        isLoading: false;
        isSuccess: false;
        status: "idle";
        reset: () => void;
        context: {
            previousData: unknown;
        };
        failureCount: number;
        isPaused: boolean;
        variables: Partial<QueryMeta>;
    } | {
        data: undefined;
        error: null;
        isError: false;
        isIdle: false;
        isLoading: true;
        isSuccess: false;
        status: "loading";
        reset: () => void;
        context: {
            previousData: unknown;
        };
        failureCount: number;
        isPaused: boolean;
        variables: Partial<QueryMeta>;
    } | {
        data: undefined;
        error: unknown;
        isError: true;
        isIdle: false;
        isLoading: false;
        isSuccess: false;
        status: "error";
        reset: () => void;
        context: {
            previousData: unknown;
        };
        failureCount: number;
        isPaused: boolean;
        variables: Partial<QueryMeta>;
    } | {
        data: any;
        error: null;
        isError: false;
        isIdle: false;
        isLoading: false;
        isSuccess: true;
        status: "success";
        reset: () => void;
        context: {
            previousData: unknown;
        };
        failureCount: number;
        isPaused: boolean;
        variables: Partial<QueryMeta>;
    };
    invalidateCache: () => void;
    data: unknown;
    error: null;
    isError: false;
    isIdle: false;
    isLoading: false;
    isLoadingError: false;
    isRefetchError: false;
    isSuccess: true;
    status: "success";
    dataUpdatedAt: number;
    errorUpdatedAt: number;
    failureCount: number;
    isFetched: boolean;
    isFetchedAfterMount: boolean;
    isFetching: boolean;
    isPlaceholderData: boolean;
    isPreviousData: boolean;
    isRefetching: boolean;
    isStale: boolean;
    refetch: <TPageData>(options?: import("react-query").RefetchOptions & import("react-query").RefetchQueryFilters<TPageData>) => Promise<import("react-query").QueryObserverResult<unknown, unknown>>;
    remove: () => void;
    queryKey: import("./types").QueryKey;
    queryMeta: QueryMeta;
};
