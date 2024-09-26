import { failure, Result, success } from "@dashlane/framework-types";
import {
  CarbonCommandError,
  CarbonCommandResult,
} from "@dashlane/communication";
interface CarbonErrorResult {
  success: false;
  error?: unknown;
}
const isCarbonErrorResult = (x: unknown): x is CarbonErrorResult => {
  if (!x || typeof x !== "object") {
    return false;
  }
  return "success" in x && x.success === false;
};
const getCarbonErrorResultError = (
  carbonErrorResult: CarbonErrorResult
): unknown => {
  if ("error" in carbonErrorResult) {
    return carbonErrorResult.error;
  }
  const { success: _success, ...extra } = carbonErrorResult;
  return extra;
};
export const carbonResultToModuleResult = (
  x: unknown
): Result<CarbonCommandResult, CarbonCommandError> => {
  if (!isCarbonErrorResult(x)) {
    return success({ id: "", carbonResult: x });
  }
  return failure({
    tag: "",
    error: getCarbonErrorResultError(x),
  });
};
