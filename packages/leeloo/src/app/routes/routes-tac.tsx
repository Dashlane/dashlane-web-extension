import * as React from 'react';
import { CustomRoute, Route } from 'libs/router';
import { Dependencies } from 'dependencies/dependencies';
import { DirectTacLogin } from 'direct-tac-login/DirectTacLogin';
import { MarketingContentType } from 'auth/auth';
import AuthRoutes from 'auth/routes';
import TeamRoutes from 'team/routes';
import { ACCOUNT_CREATION_URL_SEGMENT, DEPENDENCIES_URL_SEGMENT, DIRECT_LOGIN_URL_SEGMENT, LOGIN_URL_SEGMENT, RECOVER_2FA_CODES_URL_SEGMENT, SSO_URL_SEGMENT, } from './constants';
import { NamedRoutes } from 'app/routes/types';
import { SsoProxy } from 'sso/sso-proxy';
import { RootSwitch } from './routes-common';
import { TacTabs } from 'team/types';
import { Recover2FaCodes } from 'auth/recover-2fa-codes/recover-2fa-codes';
export const getTacRoutes = (nr: NamedRoutes): JSX.Element => {
    const path = nr.teamRoutesBasePath;
    return (<RootSwitch>
      <Route path={RECOVER_2FA_CODES_URL_SEGMENT} component={Recover2FaCodes}/>
      
      <AuthRoutes path={[LOGIN_URL_SEGMENT, ACCOUNT_CREATION_URL_SEGMENT]} options={{
            marketingContentType: MarketingContentType.DashlaneBusiness,
            requiredPermissions: 'BILLING',
        }}/>
      <CustomRoute path={DEPENDENCIES_URL_SEGMENT} component={Dependencies}/>
      <CustomRoute path={DIRECT_LOGIN_URL_SEGMENT} component={DirectTacLogin}/>
      <CustomRoute path={SSO_URL_SEGMENT} component={SsoProxy}/>
      <TeamRoutes basePath={path} path={[
            path,
            `${path}/${TacTabs.ACCOUNT}`,
            `${path}/${TacTabs.ACTIVITY}`,
            `${path}/${TacTabs.GET_STARTED}`,
            `${path}/${TacTabs.DASHBOARD}`,
            `${path}/${TacTabs.GROUPS}`,
            `${path}/${TacTabs.MEMBERS}`,
            `${path}/${TacTabs.SETTINGS}`,
            `${path}/${TacTabs.DARK_WEB_INSIGHTS}`,
        ]}/>
    </RootSwitch>);
};
