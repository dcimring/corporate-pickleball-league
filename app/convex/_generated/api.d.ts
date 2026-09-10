/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as http from "../http.js";
import type * as ingest from "../ingest.js";
import type * as league from "../league.js";
import type * as lib_aggregate from "../lib/aggregate.js";
import type * as lib_csv from "../lib/csv.js";
import type * as lib_diff from "../lib/diff.js";
import type * as lib_divisions from "../lib/divisions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  http: typeof http;
  ingest: typeof ingest;
  league: typeof league;
  "lib/aggregate": typeof lib_aggregate;
  "lib/csv": typeof lib_csv;
  "lib/diff": typeof lib_diff;
  "lib/divisions": typeof lib_divisions;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
