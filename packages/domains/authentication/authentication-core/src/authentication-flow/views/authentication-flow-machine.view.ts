import { Observable, of } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { Result, success } from "@dashlane/framework-types";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { AuthenticationMachineState } from "../flows/main-flow/types";
import { PASSPHRASE_SEPARATOR } from "../../device-transfer/services/passphrase.service";
const getEmailView = (
  state: AuthenticationMachineState
): AuthenticationFlowContracts.AuthenticationFlowEmailView => {
  return {
    step: "EmailStep" as const,
    loginEmail: state.context.login,
    localAccounts: state.context.localAccounts ?? [],
    isLoading: state.matches("ValidatingEmail") && !state.context.error,
    error: state.context.error?.data?.message,
  };
};
const getDeviceToDeviceWaitingForTransferRequestView = (
  state: AuthenticationMachineState
): AuthenticationFlowContracts.AuthenticationFlowDeviceToDeviceAuthenticationView => {
  return {
    step: "DeviceToDeviceAuthenticationStep",
    deviceToDeviceStep:
      AuthenticationFlowContracts.DeviceToDeviceAuthenticationFlowStep
        .WaitingForTransferRequest,
    localAccounts: state.context.localAccounts ?? [],
    loginEmail: state.context.login,
    error: state.context.error,
  };
};
const getDeviceToDeviceDisplayInstructionsView = (
  state: AuthenticationMachineState
): AuthenticationFlowContracts.AuthenticationFlowDeviceToDeviceAuthenticationView => {
  return {
    step: "DeviceToDeviceAuthenticationStep",
    deviceToDeviceStep:
      AuthenticationFlowContracts.DeviceToDeviceAuthenticationFlowStep
        .DisplayInstructions,
    localAccounts: state.context.localAccounts ?? [],
    loginEmail: state.context.login,
    error: state.context.error,
  };
};
const getDeviceToDeviceLoadingPassphraseView = (
  state: AuthenticationMachineState
): AuthenticationFlowContracts.AuthenticationFlowDeviceToDeviceAuthenticationView => {
  return {
    step: "DeviceToDeviceAuthenticationStep",
    deviceToDeviceStep:
      AuthenticationFlowContracts.DeviceToDeviceAuthenticationFlowStep
        .LoadingPassphrase,
    localAccounts: state.context.localAccounts ?? [],
    loginEmail: state.context.login,
    error: state.context.error,
  };
};
const getDeviceToDeviceDisplayPassphraseView = (
  state: AuthenticationMachineState
): AuthenticationFlowContracts.AuthenticationFlowDeviceToDeviceAuthenticationView => {
  return {
    step: "DeviceToDeviceAuthenticationStep",
    deviceToDeviceStep:
      AuthenticationFlowContracts.DeviceToDeviceAuthenticationFlowStep
        .DisplayPassphrase,
    localAccounts: state.context.localAccounts ?? [],
    loginEmail: state.context.login,
    passphrase: state.context.passphrase?.split(PASSPHRASE_SEPARATOR) || [],
    error: state.context.error,
  };
};
const getDeviceToDeviceLoadingAccountView = (
  state: AuthenticationMachineState
): AuthenticationFlowContracts.AuthenticationFlowDeviceToDeviceAuthenticationView => {
  return {
    step: "DeviceToDeviceAuthenticationStep",
    deviceToDeviceStep:
      AuthenticationFlowContracts.DeviceToDeviceAuthenticationFlowStep
        .LoadingAccount,
    localAccounts: state.context.localAccounts ?? [],
    loginEmail: state.context.login,
    error: state.context.error,
  };
};
const getDeviceToDeviceErrorView = (
  state: AuthenticationMachineState
): AuthenticationFlowContracts.AuthenticationFlowDeviceToDeviceAuthenticationView => {
  return {
    step: "DeviceToDeviceAuthenticationStep",
    deviceToDeviceStep:
      AuthenticationFlowContracts.DeviceToDeviceAuthenticationFlowStep.Error,
    localAccounts: state.context.localAccounts ?? [],
    loginEmail: state.context.login,
    error:
      state.context.error ??
      AuthenticationFlowContracts.DeviceToDeviceAuthenticationErrors
        .GENERIC_ERROR,
  };
};
const getDeviceToDeviceDeviceRegisteredView = (
  state: AuthenticationMachineState
): AuthenticationFlowContracts.AuthenticationFlowDeviceToDeviceAuthenticationView => {
  return {
    step: "DeviceToDeviceAuthenticationStep",
    deviceToDeviceStep:
      AuthenticationFlowContracts.DeviceToDeviceAuthenticationFlowStep
        .DeviceRegistered,
    localAccounts: state.context.localAccounts ?? [],
    loginEmail: state.context.login,
    error: state.context.error,
  };
};
const getEmailTokenView = (
  state: AuthenticationMachineState
): AuthenticationFlowContracts.AuthenticationFlowEmailTokenView => {
  return {
    step: "EmailTokenStep",
    localAccounts: state.context.localAccounts ?? [],
    loginEmail: state.context.login,
    isLoading:
      state.matches({
        DeviceRegistration: { EmailToken: "ValidatingEmailToken" },
      }) && !state.context.error,
    error: state.context.error?.data?.message,
    emailToken: state.context.emailToken,
    isDashlaneAuthenticatorAvailable:
      state.context.isDashlaneAuthenticatorAvailable,
  };
};
const getDashlaneAuthenticatorView = (
  state: AuthenticationMachineState
): AuthenticationFlowContracts.AuthenticationFlowDashlaneAuthenticatorView => {
  return {
    step: "DashlaneAuthenticatorStep",
    localAccounts: state.context.localAccounts ?? [],
    isLoading:
      state.matches({
        DeviceRegistration: { DashlaneAuthenticator: "RequestingServerPush" },
      }) && !state.context.error,
    error: state.context.error?.data?.message,
  };
};
const getTwoFactorAuthenticationOtpView = (
  state: AuthenticationMachineState
): AuthenticationFlowContracts.AuthenticationFlowTwoFactorAuthenticationOtpView => {
  return {
    step: "TwoFactorAuthenticationOtpStep",
    localAccounts: state.context.localAccounts ?? [],
    loginEmail: state.context.login,
    isLoading:
      state.matches({
        TwoFactorAuthentication: "ValidatingTwoFactorAuthenticationOtp",
      }) && !state.context.error,
    error: state.context.error?.data?.message,
    twoFactorAuthenticationOtpValue:
      state.context.twoFactorAuthenticationOtpValue,
    twoFactorAuthenticationOtpType:
      state.context.twoFactorAuthenticationOtpType,
  };
};
const getWebAuthnView = (
  state: AuthenticationMachineState
): AuthenticationFlowContracts.AuthenticationFlowWebAuthnView => {
  return {
    step: "WebAuthnStep",
    localAccounts: state.context.localAccounts ?? [],
    loginEmail: state.context.login ?? "",
    isLoading:
      state.matches({
        WebAuthn: "InitWebAuthnAuthentication",
      }) && !state.context.error,
    error: state.context.error?.data?.message,
  };
};
const getSSORedirectionToIdpView = (
  state: AuthenticationMachineState
): AuthenticationFlowContracts.AuthenticationFlowMachineSSORedirectionToIdpView => {
  return {
    step: "SSORedirectionToIdpStep",
    loginEmail: state.context.login,
    serviceProviderRedirectUrl: state.context.serviceProviderRedirectUrl ?? "",
    isNitroProvider: state.context.isNitroProvider ?? false,
    rememberMeForSSOPreference: state.context.rememberMeForSSOPreference,
    isLoading:
      state.matches({
        SSORedirectionToIdp: "InitSSOAuthentication",
      }) && !state.context.error,
    error: state.context.error?.data?.message,
    localAccounts: state.context.localAccounts ?? [],
  };
};
const getMasterPasswordView = (
  state: AuthenticationMachineState,
  isAuthenticationDone?: boolean
): AuthenticationFlowContracts.AuthenticationFlowPasswordView => {
  return {
    step: "MasterPasswordStep",
    loginEmail: state.context.login ?? "",
    localAccounts: state.context.localAccounts ?? [],
    isLoading:
      (state.matches({ MasterPassword: "ValidatingMasterPassword" }) ||
        state.matches({ MasterPassword: "CheckingMigrationNeeded" }) ||
        state.matches({ MasterPassword: "OpeningSessionWithMasterpassword" }) ||
        state.matches("MasterPasswordBasedAuthenticationDone")) &&
      !state.context.error,
    isAccountRecoveryAvailable: state.context.isAccountRecoveryAvailable,
    error: state.context.error?.data?.message,
    serviceProviderRedirectUrl: state.context.serviceProviderRedirectUrl,
    isNitroProvider: state.context.isNitroProvider ?? false,
    isAuthenticationDone,
  };
};
const getPinCodeView = (
  state: AuthenticationMachineState
): AuthenticationFlowContracts.AuthenticationFlowPinCodeView => {
  if (!state.context.login) {
    throw new Error("No email login");
  }
  return {
    step: "PinCodeStep",
    localAccounts: state.context.localAccounts ?? [],
    loginEmail: state.context.login,
    isLoading:
      state.matches({
        PinCode: "ValidatingPinCode",
      }) && !state.context.error,
    error: state.context.error?.code,
  };
};
const getStartingView = (
  state: AuthenticationMachineState
): AuthenticationFlowContracts.AuthenticationFlowStartingView => {
  return {
    step: "StartingStep",
    localAccounts: state.context.localAccounts ?? [],
  };
};
export function viewMapper(
  state: AuthenticationMachineState
): AuthenticationFlowContracts.AuthenticationFlowView {
  if (state.matches("Starting")) {
    return getStartingView(state);
  }
  if (
    state.matches("WaitingForEmail") ||
    state.matches("ValidatingEmail") ||
    state.matches("CheckPinCodeAvailableForMasterPassword") ||
    state.matches("CheckPinCodeAvailableForPasswordless")
  ) {
    return getEmailView(state);
  }
  if (
    state.matches({ DeviceRegistration: { EmailToken: "SendEmailToken" } }) ||
    state.matches({
      DeviceRegistration: { EmailToken: "WaitingForEmailToken" },
    }) ||
    state.matches({
      DeviceRegistration: { EmailToken: "ValidatingEmailToken" },
    }) ||
    state.matches({
      DeviceRegistration: { EmailToken: "FinishingEmailToken" },
    })
  ) {
    return getEmailTokenView(state);
  }
  if (
    state.matches({
      DeviceRegistration: { DashlaneAuthenticator: "RequestingServerPush" },
    }) ||
    state.matches({
      DeviceRegistration: { DashlaneAuthenticator: "AuthenticatorPushFailed" },
    }) ||
    state.matches({
      DeviceRegistration: {
        DashlaneAuthenticator: "AuthenticatorPushValidated",
      },
    })
  ) {
    return getDashlaneAuthenticatorView(state);
  }
  if (
    state.matches({ TwoFactorAuthentication: "WaitingForTotp" }) ||
    state.matches({
      TwoFactorAuthentication: "WaitingForBackupCode",
    }) ||
    state.matches({
      TwoFactorAuthentication: "ValidatingTwoFactorAuthenticationOtp",
    }) ||
    state.matches({
      TwoFactorAuthentication: "FinishingTwoFactorAuthenticationOtp",
    })
  ) {
    return getTwoFactorAuthenticationOtpView(state);
  }
  if (
    state.matches({ WebAuthn: "InitWebAuthnAuthentication" }) ||
    state.matches({ WebAuthn: "WebAuthnAuthenticationFailed" }) ||
    state.matches({ WebAuthn: "WebAuthnAuthenticationValidated" })
  ) {
    return getWebAuthnView(state);
  }
  if (state.matches("SSORedirectionToIdp")) {
    return getSSORedirectionToIdpView(state);
  }
  if (
    state.matches({ DeviceToDeviceAuthentication: "WaitingForTransferRequest" })
  ) {
    return getDeviceToDeviceWaitingForTransferRequestView(state);
  }
  if (state.matches({ DeviceToDeviceAuthentication: "DisplayInstructions" })) {
    return getDeviceToDeviceDisplayInstructionsView(state);
  }
  if (state.matches({ DeviceToDeviceAuthentication: "GeneratePassphrase" })) {
    return getDeviceToDeviceLoadingPassphraseView(state);
  }
  if (state.matches({ DeviceToDeviceAuthentication: "StartTransfer" })) {
    return getDeviceToDeviceDisplayPassphraseView(state);
  }
  if (state.matches({ DeviceToDeviceAuthentication: "OpenSession" })) {
    return getDeviceToDeviceLoadingAccountView(state);
  }
  if (state.matches({ DeviceToDeviceAuthentication: "DeviceTransferError" })) {
    return getDeviceToDeviceErrorView(state);
  }
  if (
    state.matches({ DeviceToDeviceAuthentication: "DeviceRegistered" }) ||
    state.matches("DeviceToDeviceAuthenticationDone")
  ) {
    return getDeviceToDeviceDeviceRegisteredView(state);
  }
  if (
    state.matches({ PinCode: "WaitingForPinCode" }) ||
    state.matches({ PinCode: "ValidatingPinCode" }) ||
    state.matches({ PinCode: "PinCodeError" })
  ) {
    return getPinCodeView(state);
  }
  if (
    state.matches({ MasterPassword: "CheckingAccountRecoveryStatus" }) ||
    state.matches({ MasterPassword: "WaitingForMasterPassword" }) ||
    state.matches({ MasterPassword: "ValidatingMasterPassword" }) ||
    state.matches({ MasterPassword: "OpeningSessionWithMasterpassword" }) ||
    state.matches({ MasterPassword: "CheckingMigrationNeeded" }) ||
    state.matches({ MasterPassword: "OpeningSessionWithMasterpassword" })
  ) {
    return getMasterPasswordView(state);
  }
  if (state.matches("MasterPasswordBasedAuthenticationDone")) {
    return getMasterPasswordView(state, true);
  }
  console.warn(
    "[Auth] - No view associated to state ",
    JSON.stringify(state.value)
  );
  return;
}
const projectToView$ = (
  state: AuthenticationMachineState
): Observable<Result<AuthenticationFlowContracts.AuthenticationFlowView>> => {
  return of(success(viewMapper(state)));
};
export const toView$ = (
  authFlowState$: Observable<AuthenticationMachineState>
): Observable<Result<AuthenticationFlowContracts.AuthenticationFlowView>> =>
  authFlowState$.pipe(mergeMap(projectToView$));
