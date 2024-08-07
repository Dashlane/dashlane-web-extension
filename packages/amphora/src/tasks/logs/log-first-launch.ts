import { cookiesGetAll } from "@dashlane/webextensions-apis";
import { UserFirstLaunchEvent, Web } from "@dashlane/hermes";
import { isErrorLike, makeException } from "../../logs/exceptions/make";
import { ExceptionCode } from "../../logs/exceptions/error.types";
import { sendExceptionLog } from "../../logs/exceptions/send";
import { TaskDependencies } from "../../tasks/tasks.types";
import { DashlaneCookie } from "./log-first-launch.types";
import { logError, logWarn } from "../../logs/console/logger";
async function getDashlaneCookie(): Promise<Partial<DashlaneCookie>> {
  const cookie = await cookiesGetAll({
    domain: "*****",
    name: "userFunnelCookie",
  }).catch((error) => {
    logError({
      details: { error },
      message: "Error while getting dashlane cookies",
      tags: [
        "amphora",
        "initBackground",
        "logFirstLaunch",
        "getDashlaneCookie",
      ],
    });
    throw error;
  });
  if (cookie[0]) {
    const cookieValue = decodeURIComponent(cookie[0].value);
    try {
      return JSON.parse(cookieValue);
    } catch (error) {
      const { WARNING } = ExceptionCode;
      const defaultError = {
        message: "Error parsing userFunnelCookie",
      };
      const checkedError = isErrorLike(error) ? error : defaultError;
      const exceptionWarning = makeException({
        ...checkedError,
        level: WARNING,
      });
      sendExceptionLog(exceptionWarning);
      logWarn({
        details: { error },
        message: "Error parsing userFunnelCookie",
        tags: ["amphora", "initBackground"],
      });
    }
  }
  return {};
}
function formatCookieDataValue(data?: string) {
  return data !== "" ? data : undefined;
}
export async function logFirstLaunch({
  connectors: { extensionToCarbonApiConnector: carbonApiConnector },
}: TaskDependencies): Promise<void> {
  const cookieData = await getDashlaneCookie();
  const attributionProperties: Web =
    Object.keys(cookieData).length === 0
      ? {
          has_cookie: false,
        }
      : {
          has_cookie: true,
          heap_identity: cookieData.trackingId,
          gclid: cookieData.gclid,
          everflow_transaction_id: cookieData.transaction_id,
          utm_pathname: cookieData.pathname,
          utm_referrer: formatCookieDataValue(cookieData.referrer),
          utm_source: formatCookieDataValue(cookieData.utm_source),
          utm_campaign: formatCookieDataValue(cookieData.utm_campaign),
          utm_medium: formatCookieDataValue(cookieData.utm_medium),
          utm_content: formatCookieDataValue(cookieData.utm_content),
          utm_term: formatCookieDataValue(cookieData.utm_term),
          utm_visit_timestamp: cookieData.utm_visitTimestamp,
          utm_last_click_pathname: cookieData.last_click_pathname,
          utm_last_click_referrer: formatCookieDataValue(
            cookieData.last_click_referrer
          ),
          utm_last_click_source: formatCookieDataValue(
            cookieData.last_click_source
          ),
          utm_last_click_campaign: formatCookieDataValue(
            cookieData.last_click_campaign
          ),
          utm_last_click_medium: formatCookieDataValue(
            cookieData.last_click_medium
          ),
          utm_last_click_content: formatCookieDataValue(
            cookieData.last_click_content
          ),
          utm_last_click_term: formatCookieDataValue(
            cookieData.last_click_term
          ),
          utm_last_click_visit_timestamp: cookieData.last_click_visitTimestamp,
        };
  void carbonApiConnector.logEvent({
    event: new UserFirstLaunchEvent({
      web: attributionProperties,
    }),
  });
}
