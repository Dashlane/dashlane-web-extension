import { useEffect } from 'react';
import { CarbonEndpointResult, DataStatus, useCarbonEndpoint, } from '@dashlane/carbon-api-consumers';
import type { AuthenticatorDetails } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
export interface UseWebAuthnAuthentication {
    optedIn: boolean;
    authenticators?: AuthenticatorDetails[];
}
function useWebAuthnAuthenticators(): CarbonEndpointResult<AuthenticatorDetails[]> {
    useEffect(() => {
        carbonConnector.refreshWebAuthnAuthenticators();
    }, []);
    return useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getWebAuthnAuthenticators,
        },
        liveConfig: {
            live: carbonConnector.liveWebAuthnAuthenticators,
        },
    }, []);
}
export const useWebAuthnAuthenticationOptedIn = (): boolean => {
    const webAuthnAuthenticationOptedIn = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getWebAuthnAuthenticationOptedIn,
        },
        liveConfig: {
            live: carbonConnector.liveWebAuthnAuthenticationOptedIn,
        },
    }, []);
    return (webAuthnAuthenticationOptedIn.status === DataStatus.Success &&
        webAuthnAuthenticationOptedIn.data);
};
export function useWebAuthnAuthentication(): UseWebAuthnAuthentication {
    const webAuthnAuthenticationOptedIn = useWebAuthnAuthenticationOptedIn();
    const webAuthnAuthenticators = useWebAuthnAuthenticators();
    const authenticators = (webAuthnAuthenticators.status === DataStatus.Success &&
        webAuthnAuthenticators.data) ||
        undefined;
    return {
        optedIn: webAuthnAuthenticationOptedIn,
        authenticators,
    };
}
