import { firstValueFrom, timeout } from "rxjs";
import { getSuccess, isSuccess } from "@dashlane/framework-types";
import WebsiteLog from "../../api/WebsiteLog";
import { WebsiteLogEntry } from "../types";
import { ExtraParams } from "../send";
import { carbonConnector } from "../../carbon/connector";
import { getApplicationClient } from "../../application-client";
import { ClientsOf, platformInfoApi } from "@dashlane/framework-contracts";
const MAX_EXCEPTION_COUNT_PER_TYPE_PER_SESSION = 10;
let logExceptionsCount: {
  [key: string]: number;
} = {};
export const clearExceptionsCountCache = () => {
  logExceptionsCount = {};
};
let CACHED_APP_VERSION: string | undefined = undefined;
async function getAppVersion() {
  if (!CACHED_APP_VERSION) {
    try {
      const appClient = getApplicationClient() as ClientsOf<{
        platformInfo: typeof platformInfoApi;
      }>;
      const platformInfoResult = await firstValueFrom(
        appClient.platformInfo.queries.platformInfo().pipe(timeout(200))
      );
      CACHED_APP_VERSION = isSuccess(platformInfoResult)
        ? getSuccess(platformInfoResult).appVersion
        : "unknown";
    } catch {
      CACHED_APP_VERSION = "unknown";
    }
  }
  return CACHED_APP_VERSION;
}
const rawSendWebsiteLog = (
  log: WebsiteLogEntry,
  extra: ExtraParams,
  appVersion: string
): Promise<null> =>
  new WebsiteLog()
    .create({
      level: "" + log.level,
      message: log.message,
      data: {
        ...log.content,
        version: appVersion,
        userAgent: extra.userAgent,
        sessionId: extra.sessionId,
      },
    })
    .then(() => null);
function limitExceptionPerType(
  log: WebsiteLogEntry,
  limit: number,
  fn: Function
) {
  const cacheKey = log.message || "UNKNOWN_EXCEPTION";
  logExceptionsCount[cacheKey] = logExceptionsCount[cacheKey] || 0;
  logExceptionsCount[cacheKey]++;
  if (logExceptionsCount[cacheKey] > limit) {
    console.log("Exception sent too many times, stop reporting it", log);
    return;
  }
  return fn();
}
export const sendWebsiteLogs = async (
  logs: WebsiteLogEntry[],
  extra: ExtraParams
): Promise<null> => {
  const globalExtensionSettings =
    await carbonConnector.getGlobalExtensionSettings();
  const allowedToLog = globalExtensionSettings.interactionDataConsent !== false;
  if (!allowedToLog) {
    return null;
  }
  const appVersion = await getAppVersion();
  return Promise.all(
    logs.map((log) =>
      limitExceptionPerType(log, MAX_EXCEPTION_COUNT_PER_TYPE_PER_SESSION, () =>
        rawSendWebsiteLog(log, extra, appVersion)
      )
    )
  ).then(() => null);
};
