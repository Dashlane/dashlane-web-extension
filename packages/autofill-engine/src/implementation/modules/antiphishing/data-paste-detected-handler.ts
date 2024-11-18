import {
  CredentialAutofillView,
  VaultAutofillViewInterfaces,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { ParsedURL } from "@dashlane/url-parser";
import { v4 as uuidv4 } from "uuid";
import { AutofillEngineContext } from "../../../Api/server/context";
import { PhishingPreventionWebcardData } from "../../../Api/types/webcards/phishing-prevention-webcard";
import {
  VaultIngredient,
  WebcardMetadataType,
  WebcardType,
} from "../../../types";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../abstractions/messaging/action-serializer";
import {
  checkIsAccountFrozen,
  getAutofillDataFromVault,
  getDashlaneDefinedLinkedWebsites,
  getPhishingPreventionCapability,
  getPhishingPreventionDisabledForUrl,
} from "../../abstractions/vault/get";
import { newWebcardMetadataStore } from "../../commands/private-types";
import { META_DOMAINS_WITH_STRICT_FULLDOMAIN_MATCH } from "../autofill/urls-lists";
import { isUrlUnsecure } from "../autofill/utils";
import { showFollowUpNotificationWebcard } from "./show-follow-up-notification-webcard";
import { VaultItemType } from "@dashlane/vault-contracts";
const URL_PROTOCOL_REGEXP = /^[A-Za-z+\-.]+:\/\//;
const showPhishingPreventionWebcard = (
  actions: AutofillEngineActionsWithOptions,
  rootDomains: Record<"vaultItem" | "tab", string>,
  vaultIngredient: VaultIngredient,
  itemId: string
): void => {
  const phishingPreventionWebcard: PhishingPreventionWebcardData = {
    webcardType: WebcardType.PhishingPrevention,
    webcardId: uuidv4(),
    formType: "",
    urlOfCopiedItem: rootDomains.vaultItem,
    urlOfPasteDestination: rootDomains.tab,
    metadata: newWebcardMetadataStore({
      type: WebcardMetadataType.PhishingPrevention,
      itemId,
      vaultIngredient,
    }),
  };
  actions.showWebcard(
    AutofillEngineActionTarget.MainFrame,
    phishingPreventionWebcard
  );
};
type DataPasteDecision =
  | {
      decision: "showWebcard";
      vaultItemRootDomain: string;
      tabRootDomain: string;
    }
  | {
      decision: "allowPaste";
      vaultItem: VaultAutofillViewInterfaces[VaultSourceType];
    }
  | {
      decision: "noAction";
    };
async function getCredentialItemInfo(
  context: AutofillEngineContext,
  vaultItem: CredentialAutofillView
): Promise<{
  rootDomain: string;
  hostname: string;
  urlProtocol: string;
  dashlaneDefinedLinkedWebsites: string[];
  linkedWebsites: string[];
}> {
  const parsedVaultItemUrl = new ParsedURL(vaultItem.url);
  const rootDomain = parsedVaultItemUrl.getRootDomain();
  const hostname = parsedVaultItemUrl.getHostname();
  const urlProtocol =
    URL_PROTOCOL_REGEXP.exec(vaultItem.url)?.[0] ?? "__REDACTED__";
  const dashlaneDefinedLinkedWebsites = (
    await getDashlaneDefinedLinkedWebsites(context, vaultItem.url)
  ).filter((linkedRootDomain) => linkedRootDomain !== rootDomain);
  const linkedWebsites = dashlaneDefinedLinkedWebsites.concat(
    vaultItem.userAddedLinkedWebsites.map((url: string) =>
      new ParsedURL(url).getRootDomain()
    )
  );
  return {
    rootDomain,
    hostname,
    urlProtocol,
    dashlaneDefinedLinkedWebsites,
    linkedWebsites,
  };
}
async function makeCredentialDataPasteDecision(
  context: AutofillEngineContext,
  tabUrl: string,
  vaultItem: CredentialAutofillView,
  vaultIngredient: VaultIngredient,
  action: {
    pasteBlocked: boolean;
    noPhishingAlertLimitFlagPresent?: boolean;
  }
): Promise<DataPasteDecision> {
  const vaultCredInfo = await getCredentialItemInfo(context, vaultItem);
  const parsedTabUrl = new ParsedURL(tabUrl);
  const tabRootDomain = parsedTabUrl.getRootDomain();
  const tabHostname = parsedTabUrl.getHostname();
  const tabProtocol = URL_PROTOCOL_REGEXP.exec(tabUrl)?.[0] ?? "";
  const isCopiedItemACredential =
    vaultIngredient.type === VaultSourceType.Credential;
  const protocolSecurityDowngrade =
    isUrlUnsecure(tabProtocol) && !isUrlUnsecure(vaultCredInfo.urlProtocol);
  const vaultItemDomainWithProtocol =
    (protocolSecurityDowngrade ? vaultCredInfo.urlProtocol : "") +
    vaultCredInfo.rootDomain;
  const tabDomainWithProtocol =
    (protocolSecurityDowngrade ? tabProtocol : "") + tabRootDomain;
  const optOutExists = action.noPhishingAlertLimitFlagPresent
    ? false
    : await getPhishingPreventionDisabledForUrl(
        context,
        vaultItemDomainWithProtocol,
        tabDomainWithProtocol
      );
  const unrelatedDomains =
    !vaultCredInfo.linkedWebsites.includes(tabRootDomain) &&
    (vaultCredInfo.rootDomain !== tabRootDomain ||
      (META_DOMAINS_WITH_STRICT_FULLDOMAIN_MATCH.includes(tabRootDomain) &&
        vaultCredInfo.hostname !== tabHostname));
  const shouldWarnAboutPhishing =
    isCopiedItemACredential &&
    vaultCredInfo.rootDomain &&
    !optOutExists &&
    (unrelatedDomains || protocolSecurityDowngrade);
  if (shouldWarnAboutPhishing && !action.pasteBlocked) {
    context.logException(
      new Error(`Paste should have been blocked but wasn't`),
      {
        fileName: "data-paste-detected-handler.ts",
        funcName: "dataPasteDetectedHandler",
      }
    );
    return { decision: "noAction" };
  }
  if (shouldWarnAboutPhishing && action.pasteBlocked) {
    const showSubdomain = vaultItemDomainWithProtocol === tabDomainWithProtocol;
    return {
      decision: "showWebcard",
      vaultItemRootDomain: vaultItemDomainWithProtocol,
      tabRootDomain: showSubdomain ? tabHostname : tabDomainWithProtocol,
    };
  }
  return { decision: "allowPaste", vaultItem };
}
async function makeDataPasteDecision(
  context: AutofillEngineContext,
  sender: chrome.runtime.MessageSender,
  itemId: string,
  vaultIngredient: VaultIngredient,
  action: {
    pasteBlocked: boolean;
    noPhishingAlertLimitFlagPresent?: boolean;
  }
): Promise<DataPasteDecision> {
  if (!sender.tab?.url) {
    throw new Error("Unexpected missing tab url");
  }
  const vaultItem = await getAutofillDataFromVault(
    context,
    vaultIngredient.type,
    itemId
  );
  if (!vaultItem) {
    throw new Error("Can not find source item of the copy");
  }
  if ((await checkIsAccountFrozen(context)).isB2CFrozen) {
    return { decision: "allowPaste", vaultItem };
  }
  const hasPhishingPreventionCapability = await getPhishingPreventionCapability(
    context
  );
  if (!hasPhishingPreventionCapability) {
    return { decision: "allowPaste", vaultItem };
  }
  if (vaultItem.vaultType === VaultSourceType.Credential) {
    return makeCredentialDataPasteDecision(
      context,
      sender.tab.url,
      vaultItem,
      vaultIngredient,
      action
    );
  }
  return { decision: "allowPaste", vaultItem };
}
export const dataPasteDetectedHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  itemId: string,
  vaultIngredient: VaultIngredient,
  action: {
    pasteBlocked: boolean;
    noPhishingAlertLimitFlagPresent?: boolean;
  }
) => {
  try {
    const result = await makeDataPasteDecision(
      context,
      sender,
      itemId,
      vaultIngredient,
      action
    );
    if (result.decision === "showWebcard") {
      showPhishingPreventionWebcard(
        actions,
        {
          vaultItem: result.vaultItemRootDomain,
          tab: result.tabRootDomain,
        },
        vaultIngredient,
        itemId
      );
    } else if (result.decision === "allowPaste") {
      if (action.pasteBlocked) {
        actions.permissionToPaste(AutofillEngineActionTarget.AllFrames, true);
      }
      await showFollowUpNotificationWebcard(
        context,
        actions,
        vaultIngredient,
        result.vaultItem
      );
    }
  } catch (error) {
    context.logException(error, {
      fileName: "data-paste-detected-handler.ts",
      funcName: "dataPasteDetectedHandler",
    });
    if (action.pasteBlocked) {
      actions.permissionToPaste(AutofillEngineActionTarget.AllFrames, true);
    }
  }
};
