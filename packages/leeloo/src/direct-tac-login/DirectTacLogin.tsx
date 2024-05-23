import * as React from 'react';
import { getUrlSearchParams, Redirect, useRouterGlobalSettingsContext, } from 'libs/router';
export const DirectTacLogin = () => {
    const { routes } = useRouterGlobalSettingsContext();
    const url = `${routes.teamRoutesBasePath}/login`;
    const queryParams = getUrlSearchParams();
    const email = queryParams.get('login') ?? '';
    if (email) {
        queryParams.append('email', email);
    }
    queryParams.delete('login');
    const urlWithQuery = `${url}?${queryParams}`;
    return <Redirect to={urlWithQuery}/>;
};
