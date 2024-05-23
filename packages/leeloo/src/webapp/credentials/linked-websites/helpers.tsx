import { CredentialsByDomainDataQuery } from '@dashlane/communication';
import { Credential } from '@dashlane/vault-contracts';
import { Action, AnonymousOpenExternalVaultItemLinkEvent, AnonymousUpdateCredentialEvent, DomainType, Field, hashDomain, ItemType, ItemTypeWithLink, Space, UserOpenExternalVaultItemLinkEvent, UserUpdateVaultItemEvent, } from '@dashlane/hermes';
import { ParsedURL } from '@dashlane/url-parser';
import { carbonConnector } from 'libs/carbon/connector';
import { logEvent } from 'libs/logs/logEvent';
import { LinkedWebsitesDuplicateDialogData } from './dialogs/linked-websites-duplicate-prevention-dialog';
import { openUrl } from 'libs/external-urls';
export const checkIfLinkedWebsitesHaveBeenModified = (newLinkedWebsitesAddedByUserList: string[], savedLinkedWebsitesAddedByUserList: string[]): boolean => {
    return [
        ...newLinkedWebsitesAddedByUserList,
        ...savedLinkedWebsitesAddedByUserList,
    ]
        .filter(Boolean)
        .some((website) => !(newLinkedWebsitesAddedByUserList.includes(website) &&
        savedLinkedWebsitesAddedByUserList.includes(website)));
};
const getCredentialMatchQuery = (domain: string, email: string): CredentialsByDomainDataQuery => {
    return {
        domain,
        sortToken: {
            sortCriteria: [
                {
                    field: 'lastUse',
                    direction: 'descend',
                },
            ],
            uniqField: 'id',
        },
        filterToken: {
            filterCriteria: [
                {
                    field: 'email',
                    value: email,
                    type: 'equals',
                },
            ],
        },
    };
};
export const checkForDuplicateWebsites = async (credential: Credential, linkedWebsitesAddedByUser: string[]): Promise<LinkedWebsitesDuplicateDialogData[]> => {
    const addedDomains = linkedWebsitesAddedByUser
        .filter((website: string) => website && !credential.linkedURLs.includes(website))
        .map((website) => new ParsedURL(website).getRootDomain());
    const matchedCredentialsPromises = addedDomains.map(async (domain) => await carbonConnector.getCredentialsByDomain(getCredentialMatchQuery(domain, credential.email)));
    const matchedCredentialResults = (await Promise.all(matchedCredentialsPromises)).map((cred, index) => ({
        ...cred,
        linkedWebsite: addedDomains[index],
    }));
    const duplicateCredentials = matchedCredentialResults.filter((credentialMatch) => credentialMatch.matchingCount > 0);
    return duplicateCredentials.map((credential): LinkedWebsitesDuplicateDialogData => {
        return {
            credentialName: credential.items[0].title,
            linkedWebsite: credential.linkedWebsite,
        };
    });
};
const hashMultipleDomains = async (domains: string[]) => {
    return await Promise.all(domains.map((website) => hashDomain(new ParsedURL(website).getRootDomain())));
};
export const sendLinkedWebsitesLogs = async (credential: Credential, linkedWebsitesAddedByUser: string[]) => {
    const addedWebsites = linkedWebsitesAddedByUser.filter((website: string) => website && !credential.linkedURLs.includes(website));
    const deletedWebsites = credential.linkedURLs.filter((website: string) => website && !linkedWebsitesAddedByUser.includes(website));
    const credentialURLRootDomain = new ParsedURL(credential.URL).getRootDomain();
    logEvent(new AnonymousUpdateCredentialEvent({
        action: Action.Edit,
        associatedWebsitesAddedList: await hashMultipleDomains(addedWebsites),
        associatedWebsitesRemovedList: await hashMultipleDomains(deletedWebsites),
        fieldList: [Field.AssociatedWebsitesList],
        domain: {
            type: DomainType.Web,
            id: await hashDomain(credentialURLRootDomain),
        },
        space: credential.spaceId ? Space.Professional : Space.Personal,
    }));
    logEvent(new UserUpdateVaultItemEvent({
        action: Action.Edit,
        itemId: credential.id,
        itemType: ItemType.Credential,
        fieldsEdited: [Field.AssociatedWebsitesList],
        space: credential.spaceId ? Space.Professional : Space.Personal,
    }));
};
export const goToWebsite = (url: string, credentialId: string) => async () => {
    const parsedUrl = new ParsedURL(url);
    logEvent(new UserOpenExternalVaultItemLinkEvent({
        domainType: DomainType.Web,
        itemId: credentialId,
        itemType: ItemTypeWithLink.Credential,
    }));
    logEvent(new AnonymousOpenExternalVaultItemLinkEvent({
        itemType: ItemTypeWithLink.Credential,
        domain: {
            id: await hashDomain(parsedUrl.getRootDomain()),
            type: DomainType.Web,
        },
    }));
    openUrl(parsedUrl.getUrlWithFallbackHttpsProtocol());
};
