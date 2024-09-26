import { CarbonLeelooConnector } from "../LeelooCommunication";
export interface CarbonStateListQueryParam {
  paths: string[];
}
export interface CarbonStateQueryParam {
  path: string;
}
export interface CarbonCommandParam {
  name: string;
  args: unknown[];
  fireEvent?: boolean;
}
const makeCommandList = <X extends (keyof typeof CarbonLeelooConnector)[]>(
  x: X
) => x;
export const LEGACY_CARBON_LEELOO_USED_COMMANDS = makeCommandList([
  "lockSession",
  "closeSession",
  "cancelDashlaneAuthenticatorRegistration",
  "openSession",
  "openSessionWithDashlaneAuthenticator",
  "openSessionWithOTP",
  "openSessionWithOTPForNewDevice",
  "openSessionWithToken",
  "openSessionResendToken",
  "removePersonalDataItem",
  "savePersonalDataItem",
  "sessionForceSync",
  "getLocalAccountsList",
]);
export type CarbonLeelooAccessibleCommands =
  (typeof LEGACY_CARBON_LEELOO_USED_COMMANDS)[number];
export interface CarbonLegacyLeelooCommandParam<
  T extends CarbonLeelooAccessibleCommands = CarbonLeelooAccessibleCommands
> {
  name: T;
  arg: Parameters<(typeof CarbonLeelooConnector)[T]>;
  fireEvent?: boolean;
}
export interface CarbonCommandEventCompleted {
  result: unknown;
}
export interface CarbonLegacyEventPayload {
  eventName: keyof typeof CarbonLeelooConnector;
  eventData: unknown;
}
