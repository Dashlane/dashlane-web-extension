import { VaultSourceType } from "@dashlane/autofill-contracts";
import { VaultItemDisableProtectionMode } from "@dashlane/communication";
import { getQueryValue } from "@dashlane/framework-application";
import { isSuccess } from "@dashlane/framework-types";
import { AuthenticatorUserVerificationSource } from "@dashlane/hermes";
import { v4 as uuidv4 } from "uuid";
import { AutofillEngineContext } from "../../../Api/server/context";
import { AutofillDetailsForVaultDataSource } from "../../../Api/types/autofill";
import { AutofillConfirmationPasswordLessWebcardData } from "../../../Api/types/webcards/autofill-confirmation-password-less";
import {
  NeverAskAgainMode,
  UserVerificationUsageLogDetails,
} from "../../../Api/types/webcards/user-verification-webcard";
import { WebcardType } from "../../../Api/types/webcards/webcard-data-base";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../abstractions/messaging/action-serializer";
import { buildUserVerificationWebcardData } from "./user-verification/build-user-verification-webcard-data";
import { PendingApplyAutofillDetailsOperation } from "../../commands/private-types";
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
};
export const disableAccessProtectionForVaultItemHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  _sender: chrome.runtime.MessageSender,
  vaultId: string
) => {
  await context.connectors.carbon.disableVaultItemProtection(vaultId);
};
