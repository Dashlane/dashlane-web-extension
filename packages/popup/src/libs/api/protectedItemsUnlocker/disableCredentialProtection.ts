import { carbonConnector } from 'src/carbonConnector';
export function disableCredentialProtection(credentialId: string) {
    return carbonConnector.disableCredentialProtection({
        credentialId: credentialId,
    });
}
