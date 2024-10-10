import { TwoFactorAuthenticationClientInfo } from "@dashlane/communication";
import { Action } from "Store";
export const TWO_FACTOR_AUTHENTICATION_INFO_UPDATED =
  "TWO_FACTOR_AUTHENTICATION_INFO_UPDATED";
export const TWO_FACTOR_AUTHENTICATION_INFO_REQUESTED =
  "TWO_FACTOR_AUTHENTICATION_INFO_REQUESTED";
export const TWO_FACTOR_AUTHENTICATION_INFO_ERROR =
  "TWO_FACTOR_AUTHENTICATION_INFO_ERROR";
export const TwoFactorAuthStatusUpdated = (
  info: TwoFactorAuthenticationClientInfo
): TwoFactorAuthenticationAction => ({
  type: TWO_FACTOR_AUTHENTICATION_INFO_UPDATED,
  info,
});
export const TwoFactorAuthStatusRequested =
  (): TwoFactorAuthenticationAction => ({
    type: TWO_FACTOR_AUTHENTICATION_INFO_REQUESTED,
  });
export const TwoFactorAuthStatusError = (): TwoFactorAuthenticationAction => ({
  type: TWO_FACTOR_AUTHENTICATION_INFO_ERROR,
});
export interface TwoFactorAuthenticationStatusUpdatedAction extends Action {
  type: typeof TWO_FACTOR_AUTHENTICATION_INFO_UPDATED;
  info: TwoFactorAuthenticationClientInfo;
}
export interface TwoFactorAuthenticationStatusPendingAction extends Action {
  type: typeof TWO_FACTOR_AUTHENTICATION_INFO_REQUESTED;
}
export interface TwoFactorAuthenticationStatusErrorAction extends Action {
  type: typeof TWO_FACTOR_AUTHENTICATION_INFO_ERROR;
}
export type TwoFactorAuthenticationAction =
  | TwoFactorAuthenticationStatusUpdatedAction
  | TwoFactorAuthenticationStatusPendingAction
  | TwoFactorAuthenticationStatusErrorAction;
