import {
  CredentialAutofillView,
  VaultSourceType,
} from "@dashlane/autofill-contracts";
import { ParsedURL } from "@dashlane/url-parser";
import { AutofillEngineContext } from "../../../Api/server/context";
import {
  AutofillEngineActionsWithOptions,
  AutofillEngineActionTarget,
} from "../../abstractions/messaging/action-serializer";
import { getAllAutofillDataFromVault } from "../../abstractions/vault/get";
import { getSavePasswordBusinessSpaceData } from "./business-space-helpers";
const getSavePasswordTargetCredential = async (
  context: AutofillEngineContext,
  emailOrLogin: string,
  url: string
): Promise<CredentialAutofillView | undefined> => {
  if (!emailOrLogin) {
    return undefined;
  }
  const credentials = await getAllAutofillDataFromVault({
    context,
    url,
    vaultType: VaultSourceType.Credential,
  });
  return credentials.find(
    (cred) => cred.email === emailOrLogin || cred.login === emailOrLogin
  );
};
export const findSavePasswordTargetCredentialHandler = async (
  context: AutofillEngineContext,
  actions: AutofillEngineActionsWithOptions,
  sender: chrome.runtime.MessageSender,
  emailOrLogin: string,
  url: string
) => {
  const targetCredential = await getSavePasswordTargetCredential(
    context,
    emailOrLogin,
    url
  );
  const spaces = await context.connectors.carbon.getSpaces();
  if (targetCredential) {
    actions.updateSavePasswordTargetCredential(
      AutofillEngineActionTarget.SenderFrame,
      {
        space: targetCredential.spaceId,
        showSpacesList:
          spaces.length > 1 && !targetCredential.isForceCategorizedSpace,
      },
      {
        id: targetCredential.id,
        subdomain: new ParsedURL(
          targetCredential.url
        ).getSubdomainWithoutLeadingWww(),
        onlyForThisSubdomain: targetCredential.subdomainOnly,
        isProtected: targetCredential.autoProtected,
      }
    );
  } else {
    const { showSpacesList, defaultSpace } = getSavePasswordBusinessSpaceData(
      spaces,
      emailOrLogin,
      new ParsedURL(url).getHostname()
    );
    actions.updateSavePasswordTargetCredential(
      AutofillEngineActionTarget.SenderFrame,
      {
        space: defaultSpace,
        showSpacesList,
      }
    );
  }
};
