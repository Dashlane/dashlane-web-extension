import {
  EmailTokenResult,
  LoginResultEnum,
  OpenSessionWithMasterPassword,
  PaymentUpdateToken,
  RegisterDeviceData,
  SetReactivationStatusRequest,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
import { WebAuthnAuthenticationCommands } from "Authentication/WebAuthnAuthentication/Api/commands";
import { TwoFactorAuthenticationEnableCommands } from "Authentication/TwoFactorAuthentication/Flow/Enable/Api/commands";
import { TwoFactorAuthenticationDisableCommands } from "Authentication/TwoFactorAuthentication/Flow/Disable/Api/commands";
import { TwoFactorAuthenticationCommands } from "Authentication/TwoFactorAuthentication/Api/commands";
export type AuthenticationCommands = {
  openSessionWithMasterPassword: Command<
    OpenSessionWithMasterPassword,
    LoginResultEnum
  >;
  registerDevice: Command<RegisterDeviceData, void>;
  requestEmailToken: Command<void, EmailTokenResult>;
  requestPaymentUpdateAuthenticationToken: Command<void, PaymentUpdateToken>;
  setReactivationStatus: Command<SetReactivationStatusRequest, void>;
  disableAutologin: Command<void, void>;
} & WebAuthnAuthenticationCommands &
  TwoFactorAuthenticationEnableCommands &
  TwoFactorAuthenticationDisableCommands &
  TwoFactorAuthenticationCommands;
