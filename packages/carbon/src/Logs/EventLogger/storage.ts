import {
  AnonymousBaseEvent,
  LogRepository,
  UserBaseEvent,
} from "@dashlane/hermes";
import { getCommonAppSetting } from "Application/ApplicationSettings";
import { EventLoggerServices } from ".";
import { decryptEvents, encryptEvents } from "./encryption";
export const EVENT_QUEUE_STORAGE_KEY = "EventLogger.eventQueue";
export async function storeEventsInQueue(
  services: EventLoggerServices,
  logRepository: LogRepository
) {
  const { storageService, storeService } = services;
  const asyncStorage = storageService.getLocalStorage();
  const eventLoggerQueueKey = getCommonAppSetting("eventLoggerQueueKey");
  const eventsCopy = logRepository.logStorage.copy();
  let events: Array<UserBaseEvent | AnonymousBaseEvent> = [];
  const uniqueEvents: Array<UserBaseEvent | AnonymousBaseEvent> = [];
  if (await asyncStorage.itemExists(EVENT_QUEUE_STORAGE_KEY)) {
    const encryptedEvents = await asyncStorage.readItem(
      EVENT_QUEUE_STORAGE_KEY
    );
    if (typeof encryptedEvents !== "string") {
      throw new Error(
        "value of EventLogger.eventQueue is expected to be a string"
      );
    }
    if (encryptedEvents) {
      events = await decryptEvents(
        storeService,
        encryptedEvents,
        eventLoggerQueueKey
      );
    }
  }
  events = events.concat(eventsCopy);
  events.map((x) =>
    uniqueEvents.filter((a) => a.id === x.id).length > 0
      ? null
      : uniqueEvents.push(x)
  );
  const encryptedEvents = await encryptEvents(
    storeService,
    uniqueEvents,
    eventLoggerQueueKey
  );
  await asyncStorage.writeItem(EVENT_QUEUE_STORAGE_KEY, encryptedEvents);
  const eventIds = eventsCopy.map((event) => event.id);
  logRepository.logStorage.removeEvents(eventIds);
}
export async function clearEventQueue(
  services: EventLoggerServices,
  logRepository: LogRepository
) {
  const { storageService, storeService } = services;
  const asyncStorage = storageService.getLocalStorage();
  const eventLoggerQueueKey = getCommonAppSetting("eventLoggerQueueKey");
  const encryptedEvents = await encryptEvents(
    storeService,
    [],
    eventLoggerQueueKey
  );
  await asyncStorage.writeItem(EVENT_QUEUE_STORAGE_KEY, encryptedEvents);
  const eventsCopy = logRepository.logStorage.copy();
  const eventIds = eventsCopy.map((event) => event.id);
  logRepository.logStorage.removeEvents(eventIds);
}
