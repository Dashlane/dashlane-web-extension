import { Observable, of } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { Result, success } from "@dashlane/framework-types";
import { IdentityVerificationFlowContracts } from "@dashlane/authentication-contracts";
import { IdentityVerificationMachineState } from "../flows/main-flow/types";
const getEmailTokenView = (
  state: IdentityVerificationMachineState
): IdentityVerificationFlowContracts.IdentityVerificationFlowEmailTokenView => {
  return {
    step: "EmailTokenStep" as const,
    isLoading:
      state.matches({
        DeviceRegistration: { EmailToken: "ValidatingEmailToken" },
      }) && !state.context.error,
    error: state.context.error,
    emailToken: state.context.emailToken,
    isDashlaneAuthenticatorAvailable:
      state.context.isDashlaneAuthenticatorAvailable,
  };
};
const getDashlaneAuthenticatorView = (
  state: IdentityVerificationMachineState
): IdentityVerificationFlowContracts.IdentityVerificationFlowDashlaneAuthenticatorView => {
  return {
    step: "DashlaneAuthenticatorStep" as const,
    isLoading:
      state.matches({
        DeviceRegistration: { DashlaneAuthenticator: "RequestingServerPush" },
      }) && !state.context.error,
    error: state.context.error,
  };
};
const getTwoFactorAuthenticationOtpView = (
  state: IdentityVerificationMachineState
): IdentityVerificationFlowContracts.IdentityVerificationFlowTwoFactorAuthenticationOtpView => {
  return {
    step: "TwoFactorAuthenticationOtpStep" as const,
    isLoading:
      state.matches({
        TwoFactorAuthentication: "ValidatingTwoFactorAuthenticationOtp",
      }) && !state.context.error,
    error: state.context.error,
    twoFactorAuthenticationOtpValue:
      state.context.twoFactorAuthenticationOtpValue,
    twoFactorAuthenticationOtpType:
      state.context.twoFactorAuthenticationOtpType,
  };
};
export function viewMapper(
  state: IdentityVerificationMachineState
): IdentityVerificationFlowContracts.IdentityVerificationFlowView {
  if (state.matches("Starting")) {
    return {
      step: "StartingStep" as const,
    };
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
  console.warn(
    "[Auth Ticket] - No view associated to state ",
    JSON.stringify(state.value)
  );
  return;
}
const projectToView$ = (
  state: IdentityVerificationMachineState
): Observable<
  Result<IdentityVerificationFlowContracts.IdentityVerificationFlowView>
> => {
  return of(success(viewMapper(state)));
};
export const toView$ = (
  authFlowState$: Observable<IdentityVerificationMachineState>
): Observable<
  Result<IdentityVerificationFlowContracts.IdentityVerificationFlowView>
> => authFlowState$.pipe(mergeMap(projectToView$));
