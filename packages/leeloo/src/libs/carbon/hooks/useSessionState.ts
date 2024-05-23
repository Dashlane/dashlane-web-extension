import { sessionApi } from '@dashlane/session-contracts';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { useUserLogin } from 'libs/hooks/useUserLogin';
export const useSessionState = () => {
    const userLogin = useUserLogin();
    const sessionStateResult = useModuleQuery(sessionApi, 'sessionState', {
        email: userLogin ?? '',
    });
    return sessionStateResult.status === DataStatus.Success
        ? sessionStateResult.data
        : undefined;
};
