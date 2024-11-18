import { UserToggleAnalyticsEvent } from "@dashlane/hermes";
import {
  LogEventParam,
  LogEventResult,
  LogPageViewParam,
  StyxApiResult,
} from "@dashlane/communication";
import { getGlobalExtensionSettings } from "GlobalExtensionSettings/handlers/extensionSettingsHandlers";
import { CoreServices } from "Services";
import { createLogger } from "./helpers";
import { immediatelySendEvents, queueLogRepositoryEvents } from "./queue";
import { clearEventQueue } from "./storage";
export async function logEvent(
  services: CoreServices,
  params: LogEventParam
): Promise<LogEventResult> {
  const { interactionDataConsent } = await getGlobalExtensionSettings(services);
  const allowedToLog = interactionDataConsent !== false;
  if (!allowedToLog) {
    return {
      result: StyxApiResult.NoBatchesSent,
      success: false,
    };
  }
  const { logger, logRepository } = createLogger(services);
  logger.logEvent(params.event);
  return queueLogRepositoryEvents(services, logRepository);
}
export async function logPageView(
  services: CoreServices,
  params: LogPageViewParam
): Promise<LogEventResult> {
  const { interactionDataConsent } = await getGlobalExtensionSettings(services);
  const allowedToLog = interactionDataConsent !== false;
  if (!allowedToLog) {
    return {
      result: StyxApiResult.NoBatchesSent,
      success: false,
    };
  }
  const { logger, logRepository } = createLogger(services);
  logger.logView(params.pageView, params.browseComponent);
  return queueLogRepositoryEvents(services, logRepository);
}
export async function logToggleAnalyticsEvent(
  services: CoreServices
): Promise<LogEventResult> {
  const { interactionDataConsent } = await getGlobalExtensionSettings(services);
  const { logger, logRepository } = createLogger(services);
  const allowedToLog = interactionDataConsent !== false;
  if (!allowedToLog) {
    clearEventQueue(services, logRepository);
  }
  logger.logEvent(
    new UserToggleAnalyticsEvent({
      isAnalyticsEnabled: allowedToLog,
    })
  );
  if (!interactionDataConsent) {
    try {
      return immediatelySendEvents(services, logRepository);
    } catch {
      return queueLogRepositoryEvents(services, logRepository);
    }
  }
  return queueLogRepositoryEvents(services, logRepository);
}
