import React from 'react';
import { useSelector, useStore } from 'react-redux';
import { DataStatus, useCarbonEndpoint } from '@dashlane/carbon-api-consumers';
import { carbonConnector } from 'libs/carbon/connector';
import { redirectAfterLogin } from 'libs/redirect/after-login/helpers';
import { GlobalState } from 'store/types';
import { isInitialSyncAnimationPendingSelector } from 'auth/initial-sync-progress/selectors';
export function useLoginRedirection() {
    const endpointResult = useCarbonEndpoint({
        queryConfig: {
            query: carbonConnector.getLoginStatus,
        },
        liveConfig: {
            live: carbonConnector.loginStatusChanged,
        },
    }, []);
    const isInitialSyncAnimationPending = useSelector(isInitialSyncAnimationPendingSelector);
    const store = useStore<GlobalState>();
    const shouldRedirectAfterLogin = React.useRef(true);
    React.useEffect(() => {
        if (endpointResult.status === DataStatus.Success) {
            const { loggedIn, needsSSOMigration } = endpointResult.data;
            if (!loggedIn) {
                shouldRedirectAfterLogin.current = true;
            }
            if (loggedIn &&
                shouldRedirectAfterLogin.current &&
                !isInitialSyncAnimationPending &&
                !needsSSOMigration) {
                redirectAfterLogin(store);
                shouldRedirectAfterLogin.current = false;
            }
        }
    }, [store, endpointResult, isInitialSyncAnimationPending]);
}
