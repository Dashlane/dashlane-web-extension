import { CredentialItemView } from '@dashlane/communication';
import { Credential } from '@dashlane/vault-contracts';
import { Website } from 'src/store/types';
export const sortAndMapCredentialsByDomain = (currentWebsite: Website, credentials: CredentialItemView[]) => {
    credentials.sort((a: CredentialItemView, b: CredentialItemView) => {
        return a.url.localeCompare(b.url);
    });
    let currentUrlHost = '';
    try {
        currentUrlHost = new URL(currentWebsite.fullUrl).host;
    }
    catch (e) {
    }
    const sameHost: Credential[] = [];
    const differentHostSameDomain: Credential[] = [];
    const linkedWebsite: Credential[] = [];
    credentials.forEach((credential) => {
        let credentialUrlHost = '';
        try {
            credentialUrlHost = new URL(credential.url).host;
        }
        catch (e) {
        }
        const mappedCredential: Credential = {
            ...credential,
            alternativeUsername: '',
            itemName: credential.title,
            username: credential.login,
            URL: credential.url,
            linkedURLs: [],
            lastBackupTime: 0,
        };
        if (credentialUrlHost === currentUrlHost) {
            sameHost.push(mappedCredential);
        }
        else if (credentialUrlHost.includes(currentWebsite.domain)) {
            differentHostSameDomain.push(mappedCredential);
        }
        else {
            linkedWebsite.push(mappedCredential);
        }
    });
    return sameHost.concat(differentHostSameDomain, linkedWebsite);
};
