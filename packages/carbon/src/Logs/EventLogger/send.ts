import {
  AnonymousBaseEvent,
  LogRepository,
  UserBaseEvent,
} from "@dashlane/hermes";
import { LogEventResult, StyxApiResult } from "@dashlane/communication";
import { getCommonAppSetting } from "Application/ApplicationSettings";
import { ApiAuthType, ApiRequestMethod } from "Libs/DashlaneApi/types";
import { getEventsPayload, getMakeStyxApiRequest } from "Libs/StyxApi/request";
import { StoreService } from "Store";
import { EventLoggerServices } from ".";
import { decryptEvents, encryptEvents } from "./encryption";
import { chunkArray } from "./helpers";
import { EVENT_QUEUE_STORAGE_KEY } from "./storage";
const CHUNK_SIZE = 450;
let isSendingQueue = false;
export async function sendEventQueueToStyx(
  services: EventLoggerServices
): Promise<LogEventResult> {
  if (isSendingQueue === true) {
    return {
      success: true,
      result: StyxApiResult.NoBatchesSent,
    };
  }
  isSendingQueue = true;
  const { storageService, storeService } = services;
  const asyncStorage = storageService.getLocalStorage();
  const eventLoggerQueueKey = getCommonAppSetting("eventLoggerQueueKey");
  if (!(await asyncStorage.itemExists(EVENT_QUEUE_STORAGE_KEY))) {
    isSendingQueue = false;
    return {
      success: true,
      result: StyxApiResult.NoBatchesSent,
    };
  }
  const encryptedEvents = await asyncStorage.readItem(EVENT_QUEUE_STORAGE_KEY);
  if (!encryptedEvents) {
    isSendingQueue = false;
    return {
      success: true,
      result: StyxApiResult.NoBatchesSent,
    };
  }
  if (typeof encryptedEvents !== "string") {
    throw new Error(
      "value of EventLogger.eventQueue is expected to be a string"
    );
  }
  const events: Array<AnonymousBaseEvent | UserBaseEvent> = await decryptEvents(
    storeService,
    encryptedEvents,
    eventLoggerQueueKey
  );
  const anonymousEvents = events.filter(
    (evt): evt is AnonymousBaseEvent => evt.category === "anonymous"
  );
  const userEvents = events.filter(
    (evt): evt is UserBaseEvent => evt.category === "user"
  );
  const sentAnonymousEvents = await sendStyxEvents(
    storeService,
    anonymousEvents,
    "/v1/event/anonymous"
  );
  const sentUserEvents = await sendStyxEvents(
    storeService,
    userEvents,
    "/v1/event/user"
  );
  const latestEncryptedEvents = await asyncStorage.readItem(
    EVENT_QUEUE_STORAGE_KEY
  );
  if (typeof latestEncryptedEvents !== "string") {
    throw new Error(
      "value of EventLogger.eventQueue is expected to be a string"
    );
  }
  const latestEvents = await decryptEvents(
    storeService,
    latestEncryptedEvents,
    eventLoggerQueueKey
  );
  const unsentEvents = latestEvents.filter(
    ({ id }) =>
      !(sentAnonymousEvents.includes(id) || sentUserEvents.includes(id))
  );
  const reencryptedEvents = await encryptEvents(
    storeService,
    unsentEvents,
    eventLoggerQueueKey
  );
  await asyncStorage.writeItem(EVENT_QUEUE_STORAGE_KEY, reencryptedEvents);
  const anyEventsSentSuccessfully =
    sentAnonymousEvents.length > 0 || sentUserEvents.length > 0;
  const allEventsSentSuccessfully = reencryptedEvents.length === 0;
  let result = StyxApiResult.NoBatchesSent;
  if (allEventsSentSuccessfully) {
    result = StyxApiResult.AllBatchesSent;
  } else if (anyEventsSentSuccessfully) {
    result = StyxApiResult.SomeBatchesSent;
  }
  isSendingQueue = false;
  return {
    success: true,
    result,
  };
}
export async function immediatelySendEventsToStyx(
  services: EventLoggerServices,
  logRepository: LogRepository
): Promise<LogEventResult> {
  const { storeService } = services;
  const events = logRepository.logStorage.copy();
  logRepository.logStorage.removeEvents(events.map((evt) => evt.id));
  const anonymousEvents = events.filter(
    (evt): evt is AnonymousBaseEvent => evt.category === "anonymous"
  );
  const userEvents = events.filter(
    (evt): evt is UserBaseEvent => evt.category === "user"
  );
  const sentAnonymousEvents = await sendStyxEvents(
    storeService,
    anonymousEvents,
    "/v1/event/anonymous"
  );
  const sentUserEvents = await sendStyxEvents(
    storeService,
    userEvents,
    "/v1/event/user"
  );
  const anyEventsSentSuccessfully =
    sentAnonymousEvents.length > 0 || sentUserEvents.length > 0;
  const allEventsSentSuccessfully =
    sentAnonymousEvents.length + sentUserEvents.length === events.length;
  let result = StyxApiResult.NoBatchesSent;
  if (allEventsSentSuccessfully) {
    result = StyxApiResult.AllBatchesSent;
  } else if (anyEventsSentSuccessfully) {
    result = StyxApiResult.SomeBatchesSent;
  }
  return {
    success: true,
    result,
  };
}
async function sendStyxEvents(
  storeService: StoreService,
  events: Array<UserBaseEvent | AnonymousBaseEvent>,
  pathname: string
) {
  let successfullySentIds: string[] = [];
  if (!events || events.length === 0) {
    return successfullySentIds;
  }
  const makeStyxRequest = getMakeStyxApiRequest(
    pathname,
    ApiAuthType.App,
    ApiRequestMethod.POST
  );
  const batches = chunkArray(events, CHUNK_SIZE);
  try {
    for (const batch of batches) {
      const response = await makeStyxRequest(storeService, {
        payload: getEventsPayload(batch),
      });
      if (response.success) {
        successfullySentIds = successfullySentIds.concat(
          batch.map(({ id }) => id)
        );
      } else {
        break;
      }
    }
  } catch {
    return successfullySentIds;
  }
  return successfullySentIds;
}
