import { CommandQueryBusConfig } from "Shared/Infrastructure";
import { config as webAuthnAuthenticationCommandQueryBusConfig } from "Authentication/WebAuthnAuthentication/Api/config";
import { config as twoFactorAuthenticationEnableCommandQueryBusConfig } from "Authentication/TwoFactorAuthentication/Flow/Enable/Api/config";
import { config as twoFactorAuthenticationDisableCommandQueryBusConfig } from "Authentication/TwoFactorAuthentication/Flow/Disable/Api/config";
import { config as twoFactorAuthenticationCommandsQueryBusConfig } from "Authentication/TwoFactorAuthentication/Api/config";
import { AuthenticationCommands } from "Authentication/Api/commands";
import { AuthenticationQueries } from "Authentication/Api/queries";
import { AuthenticationLiveQueries } from "Authentication/Api/live-queries";
import { reactivationStatus$ } from "Authentication/live";
import {
  requestEmailToken,
  requestPaymentUpdateAuthenticationToken,
} from "Authentication/Services";
import {
  hasOtp2TypeSelector,
  localAccountsListSelector,
  otpTypeSelector,
  reactivationStatusSelector,
} from "Authentication/selectors";
import { setReactivationStatusHandler } from "Authentication/Services/set-reactivation-status";
import { registerDeviceHandler } from "Authentication/Services/register-device";
import { disableAutologin } from "Authentication/Services/disable-autologin";
import { openSessionWithMasterPasswordHandler } from "Authentication/Services/openSessionWithMasterPasswordHandler";
export const config: CommandQueryBusConfig<
  AuthenticationCommands,
  AuthenticationQueries,
  AuthenticationLiveQueries
> = {
  commands: {
    registerDevice: { handler: registerDeviceHandler },
    requestEmailToken: { handler: requestEmailToken },
    requestPaymentUpdateAuthenticationToken: {
      handler: requestPaymentUpdateAuthenticationToken,
    },
    setReactivationStatus: { handler: setReactivationStatusHandler },
    disableAutologin: { handler: disableAutologin },
    openSessionWithMasterPassword: {
      handler: openSessionWithMasterPasswordHandler,
    },
    ...webAuthnAuthenticationCommandQueryBusConfig.commands,
    ...twoFactorAuthenticationEnableCommandQueryBusConfig.commands,
    ...twoFactorAuthenticationDisableCommandQueryBusConfig.commands,
    ...twoFactorAuthenticationCommandsQueryBusConfig.commands,
  },
  queries: {
    getHasOtp2Type: { selector: hasOtp2TypeSelector },
    getUserOtpType: { selector: otpTypeSelector },
    getLocalAccounts: {
      selector: localAccountsListSelector,
    },
    getReactivationStatus: { selector: reactivationStatusSelector },
    ...webAuthnAuthenticationCommandQueryBusConfig.queries,
    ...twoFactorAuthenticationEnableCommandQueryBusConfig.queries,
    ...twoFactorAuthenticationDisableCommandQueryBusConfig.queries,
    ...twoFactorAuthenticationCommandsQueryBusConfig.queries,
  },
  liveQueries: {
    liveReactivationStatus: { operator: reactivationStatus$ },
    ...webAuthnAuthenticationCommandQueryBusConfig.liveQueries,
    ...twoFactorAuthenticationEnableCommandQueryBusConfig.liveQueries,
    ...twoFactorAuthenticationDisableCommandQueryBusConfig.liveQueries,
    ...twoFactorAuthenticationCommandsQueryBusConfig.liveQueries,
  },
};
