import { CarbonLog } from "@dashlane/communication";
import {
  INFO_SEPARATOR,
  PARAM_SEPARATOR,
  stringifyData,
} from "../format-helpers";
export const CARBON_LOG_NAMESPACE = "carbonDebugConnector";
function formatParams(params: unknown[]) {
  const formattedParams = params.map(stringifyData);
  return formattedParams.join(PARAM_SEPARATOR);
}
export function formatLog({
  date,
  message,
  optionalParams,
}: CarbonLog): string {
  const description =
    typeof message === "string" ? message : "Invalid message type";
  const details = formatParams(optionalParams);
  const infos = details ? [date, description, details] : [date, description];
  return infos.join(INFO_SEPARATOR);
}
