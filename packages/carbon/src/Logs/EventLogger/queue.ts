import { LogRepository } from "@dashlane/hermes";
import {
  ApplicationBuildType,
  LogEventResult,
  StyxApiResult,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { immediatelySendEventsToStyx, sendEventQueueToStyx } from "./send";
import { storeEventsInQueue } from "./storage";
export async function queueLogRepositoryEvents(
  services: CoreServices,
  logRepository: LogRepository
): Promise<LogEventResult> {
  const { buildType } = services.storeService.getPlatformInfo();
  return queueEvents(services, logRepository);
}
export async function queueEvents(
  services: CoreServices,
  logRepository: LogRepository
): Promise<LogEventResult> {
  const priority = logRepository.logStorage.containsPriorityEvent();
  try {
    await storeEventsInQueue(services, logRepository);
    if (priority) {
      const success = await sendEventQueueToStyx(services);
      return success;
    }
    return {
      success: true,
      result: StyxApiResult.NoBatchesSent,
    };
  } catch (err) {
    return {
      success: false,
      result: StyxApiResult.NoBatchesSent,
    };
  }
}
export async function immediatelySendEvents(
  services: CoreServices,
  logRepository: LogRepository
): Promise<LogEventResult> {
  try {
    const success = await immediatelySendEventsToStyx(services, logRepository);
    return success;
  } catch (err) {
    return {
      success: false,
      result: StyxApiResult.NoBatchesSent,
    };
  }
}
