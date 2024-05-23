import { AnonymousOpenExternalVaultItemLinkEvent, DomainType, hashDomain, ItemTypeWithLink, UserOpenExternalVaultItemLinkEvent, } from '@dashlane/hermes';
import { ParsedURL } from '@dashlane/url-parser';
import { logEvent } from 'libs/logs/logEvent';
export const logOpenCredentialUrl = async (id: string, URL: string) => {
    void logEvent(new UserOpenExternalVaultItemLinkEvent({
        domainType: DomainType.Web,
        itemId: id,
        itemType: ItemTypeWithLink.Credential,
    }));
    void logEvent(new AnonymousOpenExternalVaultItemLinkEvent({
        itemType: ItemTypeWithLink.Credential,
        domain: {
            id: await hashDomain(new ParsedURL(URL).getRootDomain()),
            type: DomainType.Web,
        },
    }));
};
