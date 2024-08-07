import { VaultSourceType } from "@dashlane/autofill-contracts";
import { VaultItemDisableProtectionMode } from "@dashlane/communication";
import { getQueryValue } from "@dashlane/framework-application";
import { isSuccess } from "@dashlane/framework-types";
import { AuthenticatorUserVerificationSource } from "@dashlane/hermes";
import { v4 as uuidv4 } from "uuid";
import { AutofillEngineContext } from "../../../Api/server/context";
import { AutofillDetailsForVaultDataSource } from "../../../Api/types/autofill";
import {
  PendingApplyAutofillDetailsOperation,
  PendingOperation,
  PendingOperationType,
} from "../../../Api/types/pending-operation";
import { AutofillConfirmationPasswordLessWebcardData } from "../../../Api/types/webcards/autofill-confirmation-password-less";
import { MasterPasswordWebcardData } from "../../../Api/types/webcards/master-password-webcard";
import {
  NeverAskAgainMode,
  UserVerificationUsageLogDetails,
} from "../../../Api/types/webcards/user-verification-webcard";
import { WebcardType } from "../../../Api/types/webcards/webcard-data-base";
import { checkHasNewUserVerificationForItemUnlock } from "../../../config/feature-flips";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../abstractions/messaging/action-serializer";
import { buildUserVerificationWebcardData } from "./user-verification/build-user-verification-webcard-data";
const PROTECTION_MAP: Record<
  VaultItemDisableProtectionMode,
  NeverAskAgainMode
> = {
  [VaultItemDisableProtectionMode.CannotDisable]: NeverAskAgainMode.None,
  [VaultItemDisableProtectionMode.DisableGeneralSetting]:
    NeverAskAgainMode.Global,
  [VaultItemDisableProtectionMode.DisableSpecificVaultItem]:
    NeverAskAgainMode.VaultItem,
};
export interface AutofillProtectionContext {
  isProtected: boolean;
  neverAskAgainMode: NeverAskAgainMode;
}
export const getAutofillProtectionContext = async (
  context: AutofillEngineContext,
  vaultItemId: string,
  vaultType: VaultSourceType
): Promise<AutofillProtectionContext> => {
  const autofillProtectionContext = await getQueryValue(
    context.grapheneClient.autofillSecurity.queries.getAutofillProtectionContext(
      { vaultType, vaultItemId }
    )
  );
  return {
    isProtected: isSuccess(autofillProtectionContext)
      ? autofillProtectionContext.data.isProtected
      : false,
    neverAskAgainMode:
      PROTECTION_MAP[
        isSuccess(autofillProtectionContext)
          ? autofillProtectionContext.data.disableMode
          : VaultItemDisableProtectionMode.CannotDisable
      ],
  };
};
const buildAutofillConfirmationPasswordLessWebcardData = (
  pendingOperation: AutofillDetailsForVaultDataSource
): AutofillConfirmationPasswordLessWebcardData => {
  return {
    webcardId: uuidv4(),
    webcardType: WebcardType.AutofillConfirmationPasswordLess,
    pendingOperation,
    formType: pendingOperation.formClassification,
  };
};
const buildMasterPasswordWebcardData = (
  userLogin: string,
  neverAskAgainMode: NeverAskAgainMode,
  pendingOperation: PendingOperation
): MasterPasswordWebcardData => {
  return {
    webcardId: uuidv4(),
    webcardType: WebcardType.MasterPassword,
    userLogin,
    wrongPassword: false,
    pendingOperation,
    formType:
      pendingOperation.type === PendingOperationType.ApplyAutofillDetails
        ? pendingOperation.data.formClassification
        : "",
    neverAskAgainMode,
  };
};
export const askUserToConfirmAuthenticationForAutofill = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  neverAskAgainMode: NeverAskAgainMode,
  pendingAutofillOperation: PendingApplyAutofillDetailsOperation
) => {
  const isSSOUser = await context.connectors.carbon.getIsSSOUser();
  const accountType =
    await context.connectors.carbon.getAccountAuthenticationType();
  const isPasswordLessUser = isSSOUser || accountType !== "masterPassword";
  const userLogin = await context.connectors.carbon.getUserLogin();
  if (await checkHasNewUserVerificationForItemUnlock(context.connectors)) {
    const usageLogDetails: UserVerificationUsageLogDetails = {
      source: AuthenticatorUserVerificationSource.Autofill,
    };
    const webcardData = isPasswordLessUser
      ? buildAutofillConfirmationPasswordLessWebcardData(
          pendingAutofillOperation.data
        )
      : await buildUserVerificationWebcardData(
          context,
          pendingAutofillOperation,
          usageLogDetails
        );
    actions.showWebcard(AutofillEngineActionTarget.MainFrame, webcardData);
  } else {
    const webcardData = isPasswordLessUser
      ? buildAutofillConfirmationPasswordLessWebcardData(
          pendingAutofillOperation.data
        )
      : buildMasterPasswordWebcardData(
          userLogin ?? "",
          neverAskAgainMode,
          pendingAutofillOperation
        );
    actions.showWebcard(AutofillEngineActionTarget.MainFrame, webcardData);
  }
};
export const disableAccessProtectionForVaultItemHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  _sender: chrome.runtime.MessageSender,
  vaultId: string
) => {
  await context.connectors.carbon.disableVaultItemProtection(vaultId);
};
