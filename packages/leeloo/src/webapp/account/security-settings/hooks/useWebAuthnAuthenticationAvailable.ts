import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from 'libs/carbon/connector';
import { isInFirefoxExtension } from 'libs/extension';
import { useIsSSOUser } from './useIsSSOUser';
export function useWebAuthnAuthenticationAvailable(): boolean {
    const isSSOUser = useIsSSOUser();
    const userHasOtp = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getHasOtp2Type,
        },
    }, []);
    return (!isInFirefoxExtension(window.location.href) &&
        !isSSOUser &&
        userHasOtp.status === DataStatus.Success &&
        !userHasOtp.data);
}
