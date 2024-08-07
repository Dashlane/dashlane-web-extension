import {
  InitOpenSessionWithWebAuthnAuthenticatorError,
  InitOpenSessionWithWebAuthnAuthenticatorFailure,
  ReactivationStatus,
} from "@dashlane/communication";
import { isAutofillDetailsForVaultDataSource } from "../../../Api/types/autofill";
import { WebAuthnStatus } from "../../../Api/types/webauthn";
import { AutofillEngineActionTarget } from "../../abstractions/messaging/action-serializer";
import { HandlersForModuleCommands } from "../../commands/handlers";
import { applyAutofillRecipeForVaultDataSourceHandler } from "../autofill/apply-autofill-recipe-handler";
import { disableAccessProtectionForVaultItemHandler } from "./password-protection";
import { requestPaymentUpdateAuthenticationTokenHandler } from "./request-payment-update-authentication-token-handler";
import { startWebAuthnUserVerificationFlowHandler } from "./user-verification/start-webauthn-user-verification-flow-handler";
import { userVerificationCompleteHandler } from "./user-verification/user-verification-complete-handler";
import { validateWebAuthnUserVerificationFlowHandler } from "./user-verification/validate-webauthn-user-verification-flow-handler";
import { validateMasterPasswordHandler } from "./validate-master-password-handler";
import {
  webauthnUseOtherAuthenticatorHandler,
  webauthnUserCanceledHandler,
} from "./webauthn/webauthn-common";
import { webauthnIsConditionalUiSupportedHandler } from "./webauthn/webauthn-conditional-ui";
import {
  webauthnCreateHandler,
  webauthnCreateUserConfirmedHandler,
} from "./webauthn/webauthn-create";
import {
  webauthnGetHandler,
  webauthnGetUserConfirmedHandler,
} from "./webauthn/webauthn-get";
export const AuthenticationCommandHandlers: HandlersForModuleCommands<
  | "startWebAuthnUserVerificationFlow"
  | "validateWebAuthnUserVerificationFlow"
  | "startWebAuthnLoginFlow"
  | "completeWebAuthnLoginFlow"
  | "disableReactivationWebcards"
  | "validateMasterPassword"
  | "resetProtectedItemsTimerAndApplyRecipe"
  | "disableAccessProtectionForVaultItem"
  | "requestPaymentUpdateAuthenticationToken"
  | "webauthnCreate"
  | "webauthnCreateUserConfirmed"
  | "webauthnGet"
  | "webauthnGetUserConfirmed"
  | "webauthnUseOtherAuthenticator"
  | "webauthnUserCanceled"
  | "webauthnIsConditionalUiSupported"
  | "userVerificationComplete"
> = {
  startWebAuthnUserVerificationFlow: startWebAuthnUserVerificationFlowHandler,
  validateWebAuthnUserVerificationFlow:
    validateWebAuthnUserVerificationFlowHandler,
  startWebAuthnLoginFlow: async (context, actions) => {
    const loginStatus = await context.connectors.carbon.getUserLoginStatus();
    if (loginStatus.loggedIn) {
      actions.updateWebAuthnStatus(
        AutofillEngineActionTarget.SenderFrame,
        WebAuthnStatus.Success
      );
      return;
    }
    const localAccounts = await context.connectors.carbon.getLocalAccounts();
    const lastSuccessfulLoginAccount = localAccounts.find(
      (account) => account.isLastSuccessfulLogin
    );
    if (
      !lastSuccessfulLoginAccount ||
      lastSuccessfulLoginAccount.rememberMeType !== "webauthn"
    ) {
      actions.updateWebAuthnStatus(
        AutofillEngineActionTarget.SenderFrame,
        WebAuthnStatus.Error
      );
      return;
    }
    const login = lastSuccessfulLoginAccount.login;
    const initOpenSessionResult = await context.connectors.carbon
      .initOpenSessionWithWebAuthnAuthenticator({
        login,
        relyingPartyId: self.location.host,
      })
      .catch(
        (): InitOpenSessionWithWebAuthnAuthenticatorFailure => ({
          success: false,
          error: {
            code: InitOpenSessionWithWebAuthnAuthenticatorError.UNKNOWN_ERROR,
          },
        })
      );
    if (!initOpenSessionResult.success) {
      actions.updateWebAuthnStatus(
        AutofillEngineActionTarget.SenderFrame,
        WebAuthnStatus.Error
      );
      return;
    }
    actions.updateWebAuthnChallenge(AutofillEngineActionTarget.SenderFrame, {
      login,
      publicKeyOptions: initOpenSessionResult.response.publicKeyOptions,
    });
  },
  completeWebAuthnLoginFlow: async (
    context,
    actions,
    _sender,
    login,
    credential
  ) => {
    const completeOpenSessionResult = await context.connectors.carbon
      .openSessionWithWebAuthnAuthenticator({
        login,
        credential,
      })
      .catch(() => ({ success: false }));
    actions.updateWebAuthnStatus(
      AutofillEngineActionTarget.SenderFrame,
      completeOpenSessionResult.success
        ? WebAuthnStatus.Success
        : WebAuthnStatus.Error
    );
  },
  disableReactivationWebcards: async (context) => {
    await context.connectors.carbon.setReactivationStatus({
      reactivationStatus: ReactivationStatus.DISABLED,
    });
  },
  validateMasterPassword: validateMasterPasswordHandler,
  resetProtectedItemsTimerAndApplyRecipe: async (
    context,
    actions,
    sender,
    autofillDetails
  ) => {
    const isSSOUser = await context.connectors.carbon.getIsSSOUser();
    const accountType =
      await context.connectors.carbon.getAccountAuthenticationType();
    const isPasswordLessUser = isSSOUser || accountType !== "masterPassword";
    if (!isPasswordLessUser) {
      throw new Error(
        "In resetProtectedItemsTimerAndApplyRecipe, attempt to reset protection timer for non-passwordless user"
      );
    }
    if (!isAutofillDetailsForVaultDataSource(autofillDetails)) {
      throw new Error(
        `In resetProtectedItemsTimerAndApplyRecipe, called without a VaultDataSource '${autofillDetails}'`
      );
    }
    await context.grapheneClient.autofillSecurity.commands.resetProtectedItemAutofillTimer();
    await applyAutofillRecipeForVaultDataSourceHandler(
      context,
      actions,
      sender,
      autofillDetails
    );
  },
  disableAccessProtectionForVaultItem:
    disableAccessProtectionForVaultItemHandler,
  requestPaymentUpdateAuthenticationToken:
    requestPaymentUpdateAuthenticationTokenHandler,
  webauthnCreate: webauthnCreateHandler,
  webauthnCreateUserConfirmed: webauthnCreateUserConfirmedHandler,
  webauthnGet: webauthnGetHandler,
  webauthnGetUserConfirmed: webauthnGetUserConfirmedHandler,
  webauthnUseOtherAuthenticator: webauthnUseOtherAuthenticatorHandler,
  webauthnUserCanceled: webauthnUserCanceledHandler,
  webauthnIsConditionalUiSupported: webauthnIsConditionalUiSupportedHandler,
  userVerificationComplete: userVerificationCompleteHandler,
};
