import { Slot, slot } from "ts-event-bus";
import {
  AppInitialized,
  CoreServicesReady,
  SessionClosed,
  SessionOpened,
  TeamSpaceContentControlDone,
} from "EventBus/types";
export interface EventBusConnectors {
  carbonSessionOpened: Slot<SessionOpened>;
  _sessionOpened: Slot<SessionOpened>;
  syncFailure: Slot<{}>;
  syncSuccess: Slot<{}>;
  teamSpaceContentControlDone: Slot<TeamSpaceContentControlDone>;
  sessionClosed: Slot<SessionClosed>;
  familyMemberLeft: Slot<void>;
  remoteFileChanged: Slot<string>;
  appInitialized: Slot<AppInitialized>;
  coreServicesReady: Slot<CoreServicesReady>;
}
export const EventBusConnectors: EventBusConnectors = {
  syncFailure: slot<{}>(),
  syncSuccess: slot<{}>(),
  teamSpaceContentControlDone: slot<TeamSpaceContentControlDone>(),
  sessionClosed: slot<SessionClosed>(),
  familyMemberLeft: slot(),
  remoteFileChanged: slot(),
  appInitialized: slot(),
  coreServicesReady: slot(),
  _sessionOpened: slot(),
  carbonSessionOpened: slot(),
};
