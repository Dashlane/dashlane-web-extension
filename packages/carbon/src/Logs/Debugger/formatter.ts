import { CarbonError, isCarbonError } from "Libs/Error";
import { FormatLogDetail, LogEntry, LogLevel } from "Logs/Debugger/types";
const DETAIL_KEY_VALUE_SEPARATOR = ":";
const DETAILS_SEPARATOR = " ";
const LEVEL_DEBUG = "(d)";
const LEVEL_ERROR = "(e)";
const LEVEL_INFO = "(i)";
const LEVEL_VERBOSE = "(v)";
const LEVEL_WARN = "(w)";
const TAGS_SEPARATOR = "|";
function formatTags(tags: string | string[]) {
  const tagList = Array.isArray(tags) ? tags : [tags];
  return tagList.length ? ` [${tagList.join(TAGS_SEPARATOR)}]` : "";
}
function formatDetails(
  formatter: FormatLogDetail,
  details: {},
  hasMessage: boolean
) {
  const keys = Object.keys(details);
  return keys.reduce((acc, key) => {
    const isKeyNumber = Number.isInteger(parseInt(key, 10));
    const printKey = !isKeyNumber && hasMessage;
    if (printKey) {
      return (
        `${acc}${DETAILS_SEPARATOR}${key}${DETAIL_KEY_VALUE_SEPARATOR}` +
        `${formatter(details[key])}`
      );
    } else {
      return `${acc}${DETAILS_SEPARATOR}${formatter(details[key])}`;
    }
  }, "");
}
function formatError(error: Error) {
  const { stack } = error;
  let title = `${error}`;
  if (stack && typeof stack === "string") {
    const firstStackLine = stack.substr(0, stack.indexOf("\n"));
    if (firstStackLine === title) {
      title = "";
    }
  }
  const stackLine = title ? `\n${stack}` : stack;
  return `${title}${stackLine}`;
}
function formatCarbonError<ErrorCode extends number>(
  error: CarbonError<ErrorCode>
) {
  const additionalInfo = JSON.stringify(error.getAdditionalInfo());
  const additionalInfoLine = additionalInfo ? `\n${additionalInfo}` : "";
  return `${formatError(error)}${additionalInfoLine}`;
}
const levelToString = {
  [LogLevel.Error]: LEVEL_ERROR,
  [LogLevel.Warn]: LEVEL_WARN,
  [LogLevel.Info]: LEVEL_INFO,
  [LogLevel.Debug]: LEVEL_DEBUG,
  [LogLevel.Verbose]: LEVEL_VERBOSE,
};
export const formatLogEntry =
  (formatLogEntryDetail: FormatLogDetail) => (logEntry: LogEntry) => {
    const {
      details = {},
      level = LogLevel.Debug,
      message,
      tag = [],
    } = logEntry;
    const tagStr = formatTags(tag);
    const levelStr = levelToString[level];
    const hasMessage = Boolean(message);
    const messageStr = hasMessage ? ` ${message}` : "";
    const detailsStr = formatDetails(formatLogEntryDetail, details, hasMessage);
    return `${levelStr}${tagStr}${messageStr}${detailsStr}`;
  };
export const formatLogEntryDetail = (detail: unknown): string => {
  if (isCarbonError(detail)) {
    return formatCarbonError(detail);
  }
  if (detail instanceof Error) {
    return formatError(detail);
  }
  if (typeof detail === "object") {
    return JSON.stringify(detail);
  }
  return String(detail);
};
