"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimisticallyMutateCache = exports.mutateWrapper = exports.invalidateCache = exports.buildSupabaseErrorMessage = exports.getCoupledMutationQueryMeta = exports.getKeyFromMeta = exports.prefetchQueries = exports.prefetchQuery = exports.useQuery = void 0;
__exportStar(require("./types"), exports);
var useQuery_1 = require("./useQuery");
Object.defineProperty(exports, "useQuery", { enumerable: true, get: function () { return useQuery_1.useQuery; } });
var prefetchQuery_1 = require("./prefetchQuery");
Object.defineProperty(exports, "prefetchQuery", { enumerable: true, get: function () { return prefetchQuery_1.prefetchQuery; } });
var prefetchQueries_1 = require("./prefetchQueries");
Object.defineProperty(exports, "prefetchQueries", { enumerable: true, get: function () { return prefetchQueries_1.prefetchQueries; } });
var helpers_1 = require("./helpers");
Object.defineProperty(exports, "getKeyFromMeta", { enumerable: true, get: function () { return helpers_1.getKeyFromMeta; } });
Object.defineProperty(exports, "getCoupledMutationQueryMeta", { enumerable: true, get: function () { return helpers_1.getCoupledMutationQueryMeta; } });
Object.defineProperty(exports, "buildSupabaseErrorMessage", { enumerable: true, get: function () { return helpers_1.buildSupabaseErrorMessage; } });
Object.defineProperty(exports, "invalidateCache", { enumerable: true, get: function () { return helpers_1.invalidateCache; } });
var mutateWrapper_1 = require("./mutateWrapper");
Object.defineProperty(exports, "mutateWrapper", { enumerable: true, get: function () { return mutateWrapper_1.mutateWrapper; } });
var optimisticallyMutateCache_1 = require("./optimisticallyMutateCache");
Object.defineProperty(exports, "optimisticallyMutateCache", { enumerable: true, get: function () { return optimisticallyMutateCache_1.optimisticallyMutateCache; } });
