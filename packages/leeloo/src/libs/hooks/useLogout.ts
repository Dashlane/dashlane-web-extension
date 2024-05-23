import { AuthenticationFlowContracts } from '@dashlane/authentication-contracts';
import { useModuleCommands } from '@dashlane/framework-react';
import { clearCache as clearAPICache } from 'api/Api';
import { clearCache as clearWSCache } from 'libs/api';
import { GlobalDispatcher } from 'libs/carbon/triggers';
import { flushLogsRequestedAction } from 'libs/logs';
import { clearRedirectPath } from 'libs/redirect/after-login/actions';
import { close as webappClose } from '@dashlane/framework-infra/src/spi/business/webapp/close';
export const useLogout = (dispatchGlobal: GlobalDispatcher) => {
    const { logout } = useModuleCommands(AuthenticationFlowContracts.authenticationFlowApi);
    return async () => {
        dispatchGlobal(clearRedirectPath());
        dispatchGlobal(flushLogsRequestedAction());
        clearAPICache();
        clearWSCache();
        await logout();
        if (APP_PACKAGED_IN_EXTENSION) {
            webappClose();
        }
    };
};
