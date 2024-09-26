import { combineEvents, slot } from "ts-event-bus";
import { liveSlot } from "../CarbonApi";
import {
  twoFactorAuthenticationCommandsSlots,
  twoFactorAuthenticationLiveQueriesSlots,
  twoFactorAuthenticationQueriesSlots,
} from "./TwoFactorAuthentication";
import {
  EmailTokenResult,
  OtpType,
  PaymentUpdateToken,
  ReactivationStatus,
  RegisterDeviceData,
  SetReactivationStatusRequest,
  UserVerificationMethod,
} from "./types";
import {
  webAuthnAuthenticationCommandsSlots,
  webAuthnAuthenticationLiveQueriesSlots,
  webAuthnAuthenticationQueriesSlots,
} from "./WebAuthnAuthentication";
import { LoginResultEnum } from "../Login/types";
import { OpenSessionWithMasterPassword } from "../OpenSession/types";
export const authenticationCommandsSlots = combineEvents(
  {
    openSessionWithMasterPassword: slot<
      OpenSessionWithMasterPassword,
      LoginResultEnum
    >(),
    registerDevice: slot<RegisterDeviceData, void>(),
    requestEmailToken: slot<void, EmailTokenResult>(),
    requestPaymentUpdateAuthenticationToken: slot<void, PaymentUpdateToken>(),
    setReactivationStatus: slot<SetReactivationStatusRequest, void>(),
    disableAutologin: slot<void, void>(),
  },
  webAuthnAuthenticationCommandsSlots,
  twoFactorAuthenticationCommandsSlots
);
export const authenticationQueriesSlots = combineEvents(
  {
    getHasOtp2Type: slot<void, boolean>(),
    getUserOtpType: slot<void, OtpType>(),
    getReactivationStatus: slot<void, ReactivationStatus>(),
    getAvailableUserVerificationMethods: slot<void, UserVerificationMethod[]>(),
  },
  webAuthnAuthenticationQueriesSlots,
  twoFactorAuthenticationQueriesSlots
);
export const authenticationLiveQueriesSlots = combineEvents(
  {
    liveReactivationStatus: liveSlot<ReactivationStatus>(),
  },
  webAuthnAuthenticationLiveQueriesSlots,
  twoFactorAuthenticationLiveQueriesSlots
);
