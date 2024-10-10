import {
  AuthenticationCode as AuthenticationErrorCode,
  CountryCode,
  TwoFactorAuthenticationType,
} from "@dashlane/communication";
import { Action } from "Store";
import { UPDATE_TWO_FACTOR_AUTHENTICATION_ENABLE_STAGE } from "Authentication/TwoFactorAuthentication/Flow/Enable/Store/actions";
import { TwoFactorAuthenticationDataToMigrate } from "Authentication/TwoFactorAuthentication/types";
export type InitialData = undefined;
interface TwoFactorAuthenticationEnableUpdateStageUpdateAction extends Action {
  type: typeof UPDATE_TWO_FACTOR_AUTHENTICATION_ENABLE_STAGE;
  data: TwoFactorAuthenticationEnableFlowStoreState;
}
interface TwoFactorAuthenticationEnableUpdateStageStopAction extends Action {
  type: typeof UPDATE_TWO_FACTOR_AUTHENTICATION_ENABLE_STAGE;
}
export type TwoFactorAuthenticationEnableUpdateStageAction =
  | TwoFactorAuthenticationEnableUpdateStageStopAction
  | TwoFactorAuthenticationEnableUpdateStageUpdateAction;
interface TwoFactorAuthenticationEnableBase {
  readonly success: boolean;
}
export interface TwoFactorAuthenticationEnableErrorResult
  extends TwoFactorAuthenticationEnableBase {
  readonly error: {
    code: string | AuthenticationErrorCode;
  };
}
export type TwoFactorAuthenticationEnableQRCodeData = {
  seed: string;
  uri: string;
  recoveryKeys: string[];
  serverKey: string;
};
type TwoFactorAuthenticationEnableAuthenticationTypeData = {
  authenticationType: string;
  [TwoFactorAuthenticationType.LOGIN]?: TwoFactorAuthenticationDataToMigrate;
};
type TwoFactorAuthenticationEnableLogoutRequiredFlowData = {
  logoutRequired: boolean;
};
type TwoFactorAuthenticationSavedFormValues = {
  savedValues: {
    savedPhoneNumber?: string;
    savedCountryCode?: CountryCode;
    savedAuthenticationType?:
      | TwoFactorAuthenticationType.LOGIN
      | TwoFactorAuthenticationType.DEVICE_REGISTRATION;
  };
};
export type TwoFactorAuthenticationEnableStageData =
  | TwoFactorAuthenticationEnableErrorResult
  | TwoFactorAuthenticationEnableBase;
export type TwoFactorAuthenticationEnableFlowData =
  TwoFactorAuthenticationEnableQRCodeData &
    TwoFactorAuthenticationEnableAuthenticationTypeData &
    TwoFactorAuthenticationEnableLogoutRequiredFlowData &
    TwoFactorAuthenticationSavedFormValues;
export interface TwoFactorAuthenticationEnableFlowStoreState {
  stage: string;
  stageData?: TwoFactorAuthenticationEnableStageData;
  flowData?: TwoFactorAuthenticationEnableFlowData;
}
