import {
  CarbonCommandError,
  CarbonCommandResult,
} from "@dashlane/communication";
import { isFailure, Result, Success } from "@dashlane/framework-types";
interface ConvertItemToDashlaneXmlResult extends CarbonCommandResult {
  carbonResult: {
    xml: string;
  };
}
const isConvertItemToDashlaneXmlResult = (
  successfulResult: Success<CarbonCommandResult>
): successfulResult is Success<ConvertItemToDashlaneXmlResult> => {
  const result = successfulResult.data as ConvertItemToDashlaneXmlResult;
  return typeof result.carbonResult.xml === "string";
};
export const getDashlaneXmlFromCarbon = (
  result: Result<CarbonCommandResult, CarbonCommandError>
): string | null => {
  if (isFailure(result)) {
    return null;
  }
  if (!isConvertItemToDashlaneXmlResult(result)) {
    return null;
  }
  return result.data.carbonResult.xml;
};
