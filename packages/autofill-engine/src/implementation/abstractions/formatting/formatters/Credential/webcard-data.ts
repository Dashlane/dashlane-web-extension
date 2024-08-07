import {
  CredentialAutofillView,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { PremiumStatusSpaceItemView } from "@dashlane/communication";
import { MatchType } from "@dashlane/hermes";
import { AutofillEngineContext } from "../../../../../Api/server/context";
import { SimpleWebcardItem, WebcardItemType } from "../../../../../types";
import { getAutofillDataFromVault } from "../../../vault/get";
import { convertSpaceInfoForWebcard } from "../../converters";
import { buildItemProperties } from "../../utils";
import { ParsedURL } from "@dashlane/url-parser";
export const buildCredentialItemProperties = async (
  context: AutofillEngineContext,
  credentialId: string
) => {
  const credentialItem = await getAutofillDataFromVault(
    context,
    VaultSourceType.Credential,
    credentialId
  );
  return credentialItem
    ? buildItemProperties(context, VaultSourceType.Credential, credentialItem, [
        "email",
        "login",
        "secondaryLogin",
        "password",
        "otpSecret",
      ])
    : {};
};
export const getFormattedCredentialWebcardData = (
  credentialItem: CredentialAutofillView,
  premiumStatusSpace?: PremiumStatusSpaceItemView
): SimpleWebcardItem => {
  let credentialTitle = credentialItem.title;
  if (credentialTitle.match(/^".*"$/)) {
    credentialTitle = credentialTitle.substring(1);
    credentialTitle = credentialTitle.substring(0, credentialTitle.length - 1);
  }
  return {
    type: WebcardItemType.SimpleItem,
    itemId: credentialItem.id,
    itemType: VaultSourceType.Credential,
    title: credentialItem.login || credentialItem.email,
    content: credentialTitle,
    isLinkedWebsite: [
      MatchType.AssociatedWebsite,
      MatchType.UserAssociatedWebsite,
    ].includes(credentialItem.matchType),
    space: convertSpaceInfoForWebcard(premiumStatusSpace),
    isProtected: credentialItem.autoProtected,
    domain: new ParsedURL(credentialItem.url).getRootDomain(),
  };
};
