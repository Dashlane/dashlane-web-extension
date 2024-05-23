import { sessionApi } from '@dashlane/session-contracts';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
export const useSessionState = () => {
    const currentUserLogin = useModuleQuery(sessionApi, 'selectedOpenedSession');
    const sessionStateResult = useModuleQuery(sessionApi, 'sessionState', {
        email: currentUserLogin.data ?? '',
    });
    return sessionStateResult.status === DataStatus.Success
        ? sessionStateResult.data
        : undefined;
};
