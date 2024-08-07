import { VaultSourceType } from "@dashlane/autofill-contracts";
import { computeHash } from "@dashlane/framework-infra";
import { hashString } from "@dashlane/framework-services";
import { ParsedURL } from "@dashlane/url-parser";
import { AuthenticatorUserVerificationSource } from "@dashlane/hermes";
import { AutofillEngineContext } from "../../../Api/server/context";
import {
  checkHasNewUserVerificationForItemUnlock,
  checkHasPhishingPrevention,
} from "../../../config/feature-flips";
import {
  AutofillConfirmationPasswordLessWebcardData,
  MasterPasswordWebcardData,
  PendingCopyOperation,
  PendingOperationType,
  UserPasteDecision,
  UserVerificationUsageLogDetails,
  VaultIngredient,
  WebcardMetadataType,
  WebcardType,
} from "../../../types";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../abstractions/messaging/action-serializer";
import { getAutofillDataFromVault } from "../../abstractions/vault/get";
import { HandlersForModuleCommands } from "../../commands/handlers";
import { isPhishingPreventionWebcardMetadata } from "../../commands/private-types";
import { getAutofillProtectionContext } from "../authentication/password-protection";
import { buildUserVerificationWebcardData } from "../authentication/user-verification/build-user-verification-webcard-data";
import { getValueToFillFromVaultItem } from "../autofill/apply-autofill-recipe-handler";
import { dataPasteDetectedHandler } from "./data-paste-detected-handler";
import { showFollowUpNotificationWebcard } from "./show-follow-up-notification-webcard";
async function followUpPasteAllowedByUser(
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  userDecision: UserPasteDecision,
  itemId: string,
  vaultIngredient: VaultIngredient,
  tabUrl: string
): Promise<void> {
  void context.grapheneClient.autofillSecurity.commands.disablePhishingPreventionForUrl(
    {
      credentialUrl: userDecision.urlOfCopiedItem,
      pasteDestinationUrl: userDecision.urlOfPasteDestination,
    }
  );
  const vaultItem = await getAutofillDataFromVault(
    context,
    vaultIngredient.type,
    itemId,
    tabUrl
  );
  if (vaultItem) {
    await showFollowUpNotificationWebcard(
      context,
      actions,
      vaultIngredient,
      vaultItem
    );
  }
}
export const AntiPhishingCommandHandlers: HandlersForModuleCommands<
  | "dataCopiedToClipboardDetected"
  | "dataPasteDetected"
  | "copyToClipboard"
  | "signalPasteDecision"
  | "removeLinkedWebsite"
> = {
  dataCopiedToClipboardDetected: async (
    context,
    actions,
    sender,
    dataHash,
    itemId,
    vaultIngredient
  ) => {
    const isPhishingPreventionFeatureFlipEnabled =
      await checkHasPhishingPrevention(context.connectors);
    if (!sender.url && !isPhishingPreventionFeatureFlipEnabled) {
      return;
    }
    let hostnameHash: string | undefined = undefined;
    if (vaultIngredient.type === VaultSourceType.Credential) {
      try {
        const vaultItem = await getAutofillDataFromVault(
          context,
          vaultIngredient.type,
          itemId
        );
        hostnameHash = vaultItem
          ? await hashString(
              computeHash,
              new ParsedURL(vaultItem.url).getHostname()
            )
          : undefined;
      } catch (exception) {
        context.logException(exception, {
          message: "Failed to retrieve credential domain",
          fileName: "user-paste-information-handler.ts",
          funcName: "dataCopiedToClipboardDetected",
        });
      }
    }
    actions.dataCopiedAlert(
      AutofillEngineActionTarget.AllFrames,
      dataHash,
      itemId,
      vaultIngredient,
      hostnameHash
    );
  },
  dataPasteDetected: dataPasteDetectedHandler,
  copyToClipboard: async (
    context,
    actions,
    sender,
    itemId,
    ingredient,
    webcardId,
    previouslyCopiedProperties
  ) => {
    if (!sender.url || !sender.tab?.url) {
      return;
    }
    const vaultItem = await getAutofillDataFromVault(
      context,
      ingredient.type,
      itemId,
      sender.tab.url
    );
    if (!vaultItem) {
      return;
    }
    const itemProtectionContext = await getAutofillProtectionContext(
      context,
      itemId,
      ingredient.type
    );
    if (itemProtectionContext.isProtected) {
      const pendingCopyOperation: PendingCopyOperation = {
        type: PendingOperationType.CopyValue,
        itemId,
        vaultIngredient: ingredient,
        previouslyCopiedProperties,
      };
      if (await checkHasNewUserVerificationForItemUnlock(context.connectors)) {
        const isSSOUser = await context.connectors.carbon.getIsSSOUser();
        const accountType =
          await context.connectors.carbon.getAccountAuthenticationType();
        const isPasswordLessUser =
          isSSOUser || accountType !== "masterPassword";
        const usageLogDetails: UserVerificationUsageLogDetails = {
          source: AuthenticatorUserVerificationSource.CopyVaultItem,
        };
        const webcardData = isPasswordLessUser
          ? ({
              webcardId,
              webcardType: WebcardType.AutofillConfirmationPasswordLess,
              pendingCopyOperation,
              formType: "login",
            } as AutofillConfirmationPasswordLessWebcardData)
          : await buildUserVerificationWebcardData(
              context,
              pendingCopyOperation,
              usageLogDetails,
              webcardId
            );
        actions.updateWebcard(
          AutofillEngineActionTarget.MainFrame,
          webcardData
        );
      } else {
        const webcard: MasterPasswordWebcardData = {
          webcardType: WebcardType.MasterPassword,
          webcardId,
          formType: "login",
          neverAskAgainMode: itemProtectionContext.neverAskAgainMode,
          userLogin: (await context.connectors.carbon.getUserLogin()) ?? "",
          wrongPassword: false,
          pendingOperation: pendingCopyOperation,
        };
        actions.updateWebcard(AutofillEngineActionTarget.SenderFrame, webcard);
      }
    } else {
      const valueToCopy = await getValueToFillFromVaultItem(context, {
        ingredient,
        vaultItem,
      });
      if (valueToCopy) {
        actions.copyValueToClipboard(
          AutofillEngineActionTarget.AllFrames,
          valueToCopy
        );
      }
    }
  },
  signalPasteDecision: async (
    context,
    actions,
    sender,
    userDecision,
    metadata
  ) => {
    const hasPhishingPreventionFF = await checkHasPhishingPrevention(
      context.connectors
    );
    if (!sender.url || !sender.tab?.url || !hasPhishingPreventionFF) {
      return;
    }
    actions.permissionToPaste(
      AutofillEngineActionTarget.AllFrames,
      userDecision.allowedByUser
    );
    const phishingMetadata = metadata?.[WebcardMetadataType.PhishingPrevention];
    if (
      userDecision.allowedByUser &&
      phishingMetadata &&
      isPhishingPreventionWebcardMetadata(phishingMetadata)
    ) {
      await followUpPasteAllowedByUser(
        context,
        actions,
        userDecision,
        phishingMetadata.itemId,
        phishingMetadata.vaultIngredient,
        sender.tab.url
      );
    }
  },
  removeLinkedWebsite: async (
    context,
    actions,
    sender,
    credentialId,
    linkedWebsite
  ) => {
    await context.grapheneClient.linkedWebsites.commands.removeLinkedWebsite({
      credentialId,
      linkedWebsite,
    });
  },
};
