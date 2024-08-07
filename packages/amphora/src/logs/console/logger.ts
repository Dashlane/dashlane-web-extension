import { INFO_SEPARATOR, stringifyData } from "../format-helpers";
import {
  LoggerDetails,
  LoggerFunc,
  LoggerFuncParams,
  LogLevel,
} from "./logger.types";
const { DEBUG, ERROR, INFO, VERBOSE, WARNING } = LogLevel;
function formatDetails(info: LoggerDetails, withIndent: boolean): string {
  const infoKeys = Object.keys(info);
  const isErrorInstance = (value: unknown) => value instanceof Error;
  const validInfoKeys = infoKeys.filter((key) => !isErrorInstance(info[key]));
  const infos = validInfoKeys.reduce<Record<string, unknown>>((res, key) => {
    res[key] = info[key];
    return res;
  }, {});
  return stringifyData(infos, withIndent ? 2 : 0);
}
function formatInfos(infos: string[]) {
  const filledInfos = infos.filter((info) => !!info);
  return filledInfos.join(INFO_SEPARATOR);
}
function formatTags(labels: string[]) {
  const identifier = labels.join("/");
  if (!identifier) {
    return "";
  }
  return `[${identifier}]`;
}
function extractError(details: LoggerDetails) {
  return details.error instanceof Error ? details.error : null;
}
function makeLogger(logger: LoggerFunc) {
  return (data: LoggerFuncParams) => {
    const {
      details = {},
      message = "",
      tags = [],
      indentDetails = false,
    } = data;
    const identifier = formatTags(tags);
    const detailsStr = formatDetails(details, indentDetails);
    let description = formatInfos([identifier, message]);
    if (detailsStr !== "{}") {
      const separator = indentDetails ? "\n" : INFO_SEPARATOR;
      description += `${separator}${detailsStr}`;
    }
    const error = extractError(details);
    const infos = error ? [description, "\n", error] : [description];
    logger(...infos);
  };
}
export function logDebug(params: LoggerFuncParams): void {
  if (INTERNAL_LOG_LEVEL > DEBUG) {
    return;
  }
  const logger = makeLogger(console.debug);
  logger(params);
}
export function logError(params: LoggerFuncParams): void {
  if (INTERNAL_LOG_LEVEL > ERROR) {
    return;
  }
  const logger = makeLogger(console.error);
  logger(params);
}
export function logInfo(params: LoggerFuncParams): void {
  if (INTERNAL_LOG_LEVEL > INFO) {
    return;
  }
  const logger = makeLogger(console.info);
  logger(params);
}
export function logVerbose(params: LoggerFuncParams): void {
  if (INTERNAL_LOG_LEVEL > VERBOSE) {
    return;
  }
  const logger = makeLogger(console.log);
  logger(params);
}
export function logWarn(params: LoggerFuncParams): void {
  if (INTERNAL_LOG_LEVEL > WARNING) {
    return;
  }
  const logger = makeLogger(console.warn);
  logger(params);
}
