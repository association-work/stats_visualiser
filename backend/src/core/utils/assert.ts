/* eslint-disable @typescript-eslint/no-explicit-any */
import _assert = require("assert");

/**
 * Typed assertion function.
 */
export function assert(
    condition: any,
    msg?: string | Error
): asserts condition {
    _assert(condition, msg);
}
