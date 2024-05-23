import React from 'react';
import { AdminPermissionLevel } from '@dashlane/communication';
import { LOGIN_URL_SEGMENT } from 'app/routes/constants';
import { CustomRoute, Redirect, RoutesProps, Switch, WrappingRoute, } from 'libs/router';
import { PermissionChecker } from 'user/permissions';
import { ChangePlan } from './change-plan/change-plan';
import { TeamAccount } from 'team/account/team-account';
import ActivityRoutes from './activity/routes';
import { Container } from './container';
import { Dashboard } from './dashboard/dashboard';
import { DarkWebInsights } from './dark-web-insights/dark-web-insights';
import GroupsRoutes from './groups/routes';
import Members from './members';
import membersReducer from './members/member-actions/reducer';
import SettingsRoutes from './settings/routes';
import { TacTabs } from './types';
import teamReducer from './reducer';
import { withNavLayout } from 'team/page/nav-layout/with-nav-layout';
import { GetStarted } from './get-started/get-started';
function shouldRenderRouteForPermission(permissionLevelRequired: AdminPermissionLevel, userPermissions: PermissionChecker): boolean {
    if (!userPermissions.adminAccess) {
        return true;
    }
    return userPermissions.adminAccess.hasPermissionLevel(permissionLevelRequired);
}
const ChangePlanWithNav = withNavLayout(ChangePlan, TacTabs.CHANGE_PLAN);
const TeamAccountWithNav = withNavLayout(TeamAccount, TacTabs.ACCOUNT);
const GetStartedWithNav = withNavLayout(GetStarted, TacTabs.GET_STARTED);
const DashboardWithNav = withNavLayout(Dashboard, TacTabs.DASHBOARD);
const MembersWithNav = withNavLayout(Members, TacTabs.MEMBERS);
const DarkWebInsightsWithNav = withNavLayout(DarkWebInsights, TacTabs.DARK_WEB_INSIGHTS);
const routes = ({ basePath, path }: RoutesProps<string[]>): JSX.Element => {
    return (<WrappingRoute path={path} reducer={teamReducer} permission={(p) => p.loggedIn && p.adminAccess.hasTACAccess} redirectPath={LOGIN_URL_SEGMENT} component={Container}>
      <Switch>
        <Redirect exact from={`${basePath}/`} to={`${basePath}/${TacTabs.DASHBOARD}`}/>
        <CustomRoute component={ChangePlanWithNav} path={`${basePath}/${TacTabs.CHANGE_PLAN}`} permission={(p) => shouldRenderRouteForPermission('BILLING', p)}/>
        <CustomRoute component={TeamAccountWithNav} path={`${basePath}/${TacTabs.ACCOUNT}`} permission={(p) => shouldRenderRouteForPermission('BILLING', p)} redirectPath={`${basePath}/${TacTabs.GROUPS}`}/>
        <CustomRoute component={GetStartedWithNav} path={`${basePath}/${TacTabs.GET_STARTED}`} permission={(p) => shouldRenderRouteForPermission('FULL', p)} redirectPath={`${basePath}/${TacTabs.ACCOUNT}`}/>
        <CustomRoute component={DashboardWithNav} path={`${basePath}/${TacTabs.DASHBOARD}`} permission={(p) => shouldRenderRouteForPermission('FULL', p)} redirectPath={`${basePath}/${TacTabs.ACCOUNT}`}/>
        <ActivityRoutes path={`${basePath}/${TacTabs.ACTIVITY}`}/>
        <GroupsRoutes path={`${basePath}/${TacTabs.GROUPS}`} permission={(p) => shouldRenderRouteForPermission('GROUP_READ', p)}/>
        <CustomRoute component={MembersWithNav} path={`${basePath}/${TacTabs.MEMBERS}`} permission={(p) => shouldRenderRouteForPermission('FULL', p)} redirectPath={`${basePath}/${TacTabs.ACCOUNT}`} reducer={membersReducer}/>
        <CustomRoute component={DarkWebInsightsWithNav} path={`${basePath}/${TacTabs.DARK_WEB_INSIGHTS}`} permission={(p) => shouldRenderRouteForPermission('FULL', p)} redirectPath={`${basePath}/${TacTabs.DARK_WEB_INSIGHTS}`} reducer={membersReducer}/>
        <SettingsRoutes path={`${basePath}/${TacTabs.SETTINGS}`}/>
      </Switch>
    </WrappingRoute>);
};
export default routes;
