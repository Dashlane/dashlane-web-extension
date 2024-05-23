import React from 'react';
import { useHistory } from 'libs/router';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { ChangeMasterPasswordProgress } from 'webapp/change-master-password-progress/change-master-password-progress';
export const ChangeMasterPasswordFlow = () => {
    const history = useHistory();
    const { routes } = useRouterGlobalSettingsContext();
    const handleClickOpenUserVault = () => {
        history.replace(routes.clientRoutesBasePath);
    };
    return (<ChangeMasterPasswordProgress onOpenUserVault={handleClickOpenUserVault}/>);
};
