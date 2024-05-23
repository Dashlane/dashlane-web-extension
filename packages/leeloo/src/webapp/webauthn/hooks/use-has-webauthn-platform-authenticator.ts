import { useEffect, useState } from 'react';
import { hasWebAuthnPlatformAuthenticator } from '../helpers/browserWebAuthnAuthentication';
export const useHasWebAuthnPlatformAuthenticator = () => {
    const [userHasWebAuthnPlatformAuthenticator, setUserHasWebAuthnPlatformAuthenticator,] = useState<boolean | null>(null);
    useEffect(() => {
        (async () => {
            const userHasAuthenticator = await hasWebAuthnPlatformAuthenticator();
            setUserHasWebAuthnPlatformAuthenticator(userHasAuthenticator);
        })();
    }, []);
    return userHasWebAuthnPlatformAuthenticator;
};
