import React from 'react';
import { Dependencies } from 'dependencies/dependencies';
import DevToolsWrapper from 'dev-tools-wrapper';
import { SsoProxy } from 'sso/sso-proxy';
import { DirectTacLogin } from 'direct-tac-login/DirectTacLogin';
import AccountRecoveryRoutes from 'account-recovery/routes';
import AccountRoutes from 'account/routes';
import { MarketingContentType } from 'auth/auth';
import AuthRoutes from 'auth/routes';
import { DeleteOrResetAccount } from 'delete-or-reset-account/delete-or-reset-account';
import FamilyRoutes from 'family/routes';
import { Alias as AliasDeeplinkRedirect, buildClientProps as buildAliasDeeplinkRedirectClientProps, } from 'libs/redirect/deeplink/alias';
import { CustomRoute, Redirect, Route, WrappingRoute } from 'libs/router';
import MemberRoutes from 'member/routes';
import TeamMemberCreateRoutes from 'teamMemberCreate';
import WebAppRoutes from 'webapp/routes';
import { AppSelector } from './app-selector';
import { ACCOUNT_CREATION_TAC_URL_SEGMENT, ACCOUNT_CREATION_URL_SEGMENT, ACCOUNT_RECOVERY_URL_SEGMENT, DELETE_ACCOUNT_URL_SEGMENT, DEPENDENCIES_URL_SEGMENT, DIRECT_LOGIN_URL_SEGMENT, EMPLOYEE_ACCOUNT_CREATION_URL_SEGMENT, FAMILY_URL_SEGMENT, LOGIN_TAC_URL_SEGMENT, LOGIN_URL_SEGMENT, MEMBER_URL_SEGMENT, RECOVER_2FA_CODES_URL_SEGMENT, RESET_ACCOUNT_URL_SEGMENT, RoutingSchemeOptions, SSO_URL_SEGMENT, WAC_TAC_URL_SEGMENT, WAC_URL_SEGMENT, } from './constants';
import { getAllWebAppRoutes } from './helpers';
import { RootSwitch } from './routes-common';
import { NamedRoutes } from './types';
import { Recover2FaCodes } from 'auth/recover-2fa-codes/recover-2fa-codes';
export const getAllAppsRoutes = (nr: NamedRoutes, routingSchemeOptions: RoutingSchemeOptions): JSX.Element => {
    const path = nr.clientRoutesBasePath;
    return (<>
      <RootSwitch>
        <Redirect exact from={`${path}/`} to={nr.userCredentials}/>
        
        <Redirect exact from={`${path}${LOGIN_TAC_URL_SEGMENT}`} to={LOGIN_TAC_URL_SEGMENT}/>
        <AliasDeeplinkRedirect {...buildAliasDeeplinkRedirectClientProps(path)}/>
        
        <CustomRoute exact path="/" component={AppSelector}/>
        
        <AuthRoutes path={[LOGIN_TAC_URL_SEGMENT, ACCOUNT_CREATION_TAC_URL_SEGMENT]} options={{
            marketingContentType: MarketingContentType.DashlaneBusiness,
        }}/>
        <Route path={RECOVER_2FA_CODES_URL_SEGMENT} component={Recover2FaCodes}/>
        
        <AuthRoutes path={[
            LOGIN_URL_SEGMENT,
            ACCOUNT_CREATION_URL_SEGMENT,
            EMPLOYEE_ACCOUNT_CREATION_URL_SEGMENT,
        ]}/>
        
        <WebAppRoutes routingSchemeOptions={routingSchemeOptions} basePath={path} path={getAllWebAppRoutes(path)}/>
        <MemberRoutes path={MEMBER_URL_SEGMENT}/>
        <TeamMemberCreateRoutes path={WAC_TAC_URL_SEGMENT}/>
        <AccountRoutes path={WAC_URL_SEGMENT}/>
        <FamilyRoutes path={FAMILY_URL_SEGMENT}/>
        <AccountRecoveryRoutes path={ACCOUNT_RECOVERY_URL_SEGMENT}/>
        <CustomRoute path={DELETE_ACCOUNT_URL_SEGMENT} component={DeleteOrResetAccount} additionalProps={{ isDelete: true }}/>
        <CustomRoute path={RESET_ACCOUNT_URL_SEGMENT} component={DeleteOrResetAccount} additionalProps={{ isDelete: false }}/>
        <CustomRoute path={SSO_URL_SEGMENT} component={SsoProxy}/>
        <CustomRoute path={DEPENDENCIES_URL_SEGMENT} component={Dependencies}/>
        <CustomRoute path={DIRECT_LOGIN_URL_SEGMENT} component={DirectTacLogin}/>
      </RootSwitch>
      <WrappingRoute component={DevToolsWrapper}/>
    </>);
};
