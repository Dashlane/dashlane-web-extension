import {
  AnonymousRevealVaultItemFieldEvent,
  DomainType,
  hashDomain,
  ItemType,
  UserRevealVaultItemFieldEvent,
  Field as VaultItemField,
} from "@dashlane/hermes";
import { ParsedURL } from "@dashlane/url-parser";
import { openUrl } from "../../../libs/external-urls";
import { logOpenCredentialUrl } from "../../../libs/logs/events/vault/open-external-vault-item-link";
import { logEvent } from "../../../libs/logs/logEvent";
import { capitalize } from "lodash";
export const goToWebsite = (id: string, URL: string): void => {
  const parsedUrl = new ParsedURL(URL);
  logOpenCredentialUrl(id, URL);
  openUrl(parsedUrl.getUrlWithFallbackHttpsProtocol());
};
export const logRevealPassword = async (
  url: string,
  id: string,
  autoProtected?: boolean,
  credentialsGloballyRequireMP?: boolean
) => {
  const valuesURLRootDomain = new ParsedURL(url).getRootDomain();
  const isProtectedField = !!autoProtected || !!credentialsGloballyRequireMP;
  if (id) {
    logEvent(
      new UserRevealVaultItemFieldEvent({
        field: VaultItemField.Password,
        isProtected: isProtectedField,
        itemId: id,
        itemType: ItemType.Credential,
      })
    );
    logEvent(
      new AnonymousRevealVaultItemFieldEvent({
        field: VaultItemField.Password,
        itemType: ItemType.Credential,
        domain: {
          id: await hashDomain(valuesURLRootDomain),
          type: DomainType.Web,
        },
      })
    );
  }
};
export const capitalizedCredUrlDomainName = (url: string) => {
  return capitalize(new ParsedURL(url).getRootDomainName());
};
