import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import {
  defineFunctionalError,
  FunctionalErrorOf,
} from "@dashlane/framework-types";
export interface DeviceKeys {
  readonly accessKey: string;
  readonly secretKey: string;
}
export interface AnalyticsIds {
  userId: string;
  deviceId: string;
}
export interface SessionInfo {
  login: string;
  deviceAccessKey: string;
  deviceKeys: DeviceKeys;
  analytics: AnalyticsIds;
  publicUserId: string;
}
export const NO_USER_LOGGED_IN = "no-user-logged-in";
export const NoUserLoggedInError = defineFunctionalError(
  NO_USER_LOGGED_IN,
  "User is not logged in"
)();
export type NoUserLoggedInError = FunctionalErrorOf<typeof NO_USER_LOGGED_IN>;
export class CurrentSessionInfoQuery extends defineQuery<
  SessionInfo,
  NoUserLoggedInError
>({
  scope: UseCaseScope.User,
  noUserError: NoUserLoggedInError,
}) {}
