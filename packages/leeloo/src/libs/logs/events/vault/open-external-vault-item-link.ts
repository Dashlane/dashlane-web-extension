import {
  AnonymousOpenExternalVaultItemLinkEvent,
  DomainType,
  hashDomain,
  ItemTypeWithLink,
  UserOpenExternalVaultItemLinkEvent,
} from "@dashlane/hermes";
import { ParsedURL } from "@dashlane/url-parser";
import { logEvent } from "../../logEvent";
export const logOpenCredentialUrl = async (id: string, URL: string) => {
  const credentialRootDomain = new ParsedURL(URL).getRootDomain();
  logEvent(
    new UserOpenExternalVaultItemLinkEvent({
      domainType: DomainType.Web,
      itemId: id,
      itemType: ItemTypeWithLink.Credential,
    })
  );
  logEvent(
    new AnonymousOpenExternalVaultItemLinkEvent({
      itemType: ItemTypeWithLink.Credential,
      domain: {
        id: await hashDomain(credentialRootDomain),
        type: DomainType.Web,
      },
    })
  );
};
