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
exports.prefetchQuery = void 0;
const postgrest_js_1 = require("@supabase/postgrest-js");
const helpers_1 = require("./helpers");
const supastruct_1 = require("supastruct");
const prefetchQuery = (query, queryClient) => __awaiter(void 0, void 0, void 0, function* () {
    if (query instanceof postgrest_js_1.PostgrestQueryBuilder)
        query = query.select();
    const queryMeta = (0, supastruct_1.getMetaFromQuery)(query);
    const queryKey = (0, helpers_1.getKeyFromMeta)(queryMeta);
    const response = yield query;
    queryClient.prefetchQuery(queryKey, () => Promise.resolve(response.data));
    return Object.assign({ queryKey }, response);
});
exports.prefetchQuery = prefetchQuery;
