import { createEventBus, EventDeclaration } from "ts-event-bus";
import { EventBusConnectors } from "EventBus/connectors";
export type EventBusService = typeof EventBusConnectors;
export const makeEventBusService = (): EventBusService => {
  return createEventBus({
    events: EventBusConnectors as unknown as EventDeclaration,
  }) as unknown as EventBusService;
};
export * from "EventBus/types";
