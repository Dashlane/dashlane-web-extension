import { VaultSourceType } from "@dashlane/autofill-contracts";
import { computeHash } from "@dashlane/framework-infra";
import { hashString } from "@dashlane/framework-services";
import { ParsedURL } from "@dashlane/url-parser";
import { AuthenticatorUserVerificationSource } from "@dashlane/hermes";
import { AutofillEngineContext } from "../../../Api/server/context";
import {
  AutofillConfirmationPasswordLessWebcardData,
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
import {
  isPhishingPreventionWebcardMetadata,
  PendingCopyOperation,
  PendingOperationType,
} from "../../commands/private-types";
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
  vaultIngredient: VaultIngredient
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
    itemId
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
      itemId
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
      const isSSOUser = await context.connectors.carbon.getIsSSOUser();
      const accountType =
        await context.connectors.carbon.getAccountAuthenticationType();
      const isPasswordLessUser = isSSOUser || accountType !== "masterPassword";
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
      actions.updateWebcard(AutofillEngineActionTarget.MainFrame, webcardData);
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
    if (!sender.url || !sender.tab?.url) {
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
        phishingMetadata.vaultIngredient
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
