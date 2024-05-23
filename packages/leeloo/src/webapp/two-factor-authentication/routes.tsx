import * as React from 'react';
import { TwoFactorAuthenticationEnforceView } from './business/components/enforce-2fa-view';
import { CustomRoute, RoutesProps } from 'libs/router';
export const TwoFactorAuthenticationRoutes = ({ path }: RoutesProps) => {
    return (<CustomRoute path={`${path}/enforce`} component={TwoFactorAuthenticationEnforceView}/>);
};
