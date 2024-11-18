import { postDataToUrl } from "Utils";
import { ExceptionLogRequest } from "Logs/Exception/types";
export const EXCEPTION_LOG_ENDPOINT = "__REDACTED__";
const MAX_EXCEPTION_COUNT_PER_TYPE_PER_SESSION = 10;
export default function (log: ExceptionLogRequest): Promise<void> {
  return limitExceptionPerType(
    log,
    MAX_EXCEPTION_COUNT_PER_TYPE_PER_SESSION,
    () => {
      return postDataToUrl(EXCEPTION_LOG_ENDPOINT, log)
        .then(() => {})
        .catch((e) => {
          console.error(`[background/carbon] Failed to send exception log`, e);
        });
    }
  );
}
const logExceptionsCount: {
  [key: string]: number;
} = {};
function limitExceptionPerType(
  log: ExceptionLogRequest,
  limit: number,
  fn: () => Promise<void>
): Promise<void> {
  const cacheKey =
    log.message || log.functionName || log.file || "UNKNOWN_EXCEPTION";
  logExceptionsCount[cacheKey] = logExceptionsCount[cacheKey] || 0;
  logExceptionsCount[cacheKey]++;
  if (logExceptionsCount[cacheKey] > limit) {
    return Promise.resolve();
  }
  return fn();
}
