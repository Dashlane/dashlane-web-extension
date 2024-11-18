import { CarbonEventEmitter } from "./carbon-events-emitter";
import {
  CarbonLeelooEvents,
  LEGACY_LEELOO_SLOTS_ALL,
  Unsubscribe,
} from "./carbon-legacy-infrastructure";
type AllLeelooEvents = (typeof LEGACY_LEELOO_SLOTS_ALL)[number];
export const LEGACY_LEELOO_EVENTS_TO_SUBSCRIBE: AllLeelooEvents[] = [
  "carbonLoginStatusChanged",
  "openSessionTokenSent",
  "openSessionAskMasterPassword",
  "openSessionDashlaneAuthenticator",
  "openSessionOTPSent",
  "openSessionOTPForNewDeviceRequired",
  "openSessionFailed",
  "openSessionSsoRedirectionToIdpRequired",
  "openSessionMasterPasswordLess",
  "ssoSolutionChanged",
];
export function relayLeelooLegacyEvents(
  eventInterface: CarbonLeelooEvents,
  eventEmitter: CarbonEventEmitter
): Unsubscribe {
  const unsubscribes = LEGACY_LEELOO_EVENTS_TO_SUBSCRIBE.map((eventName) =>
    (
      eventInterface[eventName] as {
        on: any;
      }
    ).on(async (eventData: unknown) => {
      await eventEmitter.sendEvent("carbonLegacy", {
        eventData,
        eventName,
      });
    })
  );
  return () => {
    unsubscribes.forEach((unsubcribe) => {
      unsubcribe();
    });
  };
}
