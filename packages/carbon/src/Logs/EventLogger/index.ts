import { Event, LogRepository, UserSyncEvent } from "@dashlane/hermes";
import { LogEventResult } from "@dashlane/communication";
import { StoreService } from "Store/index";
import { config } from "config-service";
import { getAppContext, getBrowserContext, getOsContext } from "./helpers";
import { StorageService } from "Libs/Storage/types";
import { getCommonAppSetting } from "Application/ApplicationSettings";
import { sendEventQueueToStyx } from "./send";
import { storeEventsInQueue } from "./storage";
import { getGlobalExtensionSettings } from "GlobalExtensionSettings/handlers/extensionSettingsHandlers";
import { CoreServices } from "Services";
import { EventLoggerStoreFactory } from "./store-factory";
export { bootstrap } from "Logs/EventLogger/bootstrap";
export interface EventLoggerService {
  initRepository: () => void;
  getRepository: (eventName: string) => LogRepository;
  logSync: (event: UserSyncEvent) => Promise<void>;
  logEvent: (event: Event) => Promise<void>;
  flushEventQueue: () => Promise<LogEventResult>;
}
export interface EventLoggerServices {
  storeService: StoreService;
  storageService: StorageService;
}
export const makeEventLoggerService = (
  services: EventLoggerServices
): EventLoggerService => {
  let logRepository: LogRepository = null;
  const getRepository = (eventName: string) => {
    if (!logRepository) {
      throw new Error(
        `makeEventLoggerService: You must call initRepository() before getting the repository instance, eventName: ${eventName}`
      );
    }
    const storeService = services.storeService;
    const userSession = storeService.getUserSession();
    if (
      userSession.analyticsIds?.userAnalyticsId ||
      userSession.analyticsIds?.deviceAnalyticsId
    ) {
      logRepository.setTrackingInfo(
        userSession.analyticsIds.userAnalyticsId,
        userSession.analyticsIds.deviceAnalyticsId
      );
    }
    return logRepository;
  };
  return {
    initRepository: () => {
      const storeService = services.storeService;
      const app = getAppContext(storeService);
      const os = getOsContext(storeService);
      const browser = getBrowserContext();
      const installationId = getCommonAppSetting("installationId");
      const storeFactory = new EventLoggerStoreFactory(storeService);
      logRepository = new LogRepository(
        app,
        os,
        browser,
        installationId,
        undefined,
        false,
        storeFactory
      );
      const userSession = storeService.getUserSession();
      if (
        userSession.analyticsIds?.userAnalyticsId ||
        userSession.analyticsIds?.deviceAnalyticsId
      ) {
        logRepository.setTrackingInfo(
          userSession.analyticsIds.userAnalyticsId,
          userSession.analyticsIds.deviceAnalyticsId
        );
      }
      if (config.MANIFEST_VERSION === 3) {
        logRepository.setServiceWorkerStartTime(new Date().toISOString());
      }
    },
    getRepository,
    logEvent: async (event: Event) => {
      const { interactionDataConsent } = await getGlobalExtensionSettings(
        services as CoreServices
      );
      const allowedToLog = interactionDataConsent !== false;
      if (!allowedToLog) {
        return;
      }
      const logRepo = getRepository(event.name);
      const logger = logRepo.createLogger();
      logger.logEvent(event);
      return storeEventsInQueue(services, logRepository);
    },
    logSync: async (event: UserSyncEvent) => {
      const { interactionDataConsent } = await getGlobalExtensionSettings(
        services as CoreServices
      );
      const allowedToLog = interactionDataConsent !== false;
      if (!allowedToLog) {
        return;
      }
      const logRepo = getRepository(event.name);
      const logger = logRepo.createLogger();
      logger.logEvent(event);
      return storeEventsInQueue(services, logRepository);
    },
    flushEventQueue: () => {
      return sendEventQueueToStyx(services);
    },
  };
};
