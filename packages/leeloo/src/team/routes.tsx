import { AdminPermissionLevel } from "@dashlane/communication";
import { LOGIN_URL_SEGMENT } from "../app/routes/constants";
import {
  CustomRoute,
  Redirect,
  RoutesProps,
  Switch,
  WrappingRoute,
} from "../libs/router";
import { PermissionChecker } from "../user/permissions";
import { ChangePlan } from "./change-plan/change-plan";
import { PostTrialCheckout } from "./post-trial-checkout";
import { AccountSummary } from "./account/account-summary";
import ActivityRoutes from "./activity/routes";
import { Container } from "./container";
import { Dashboard } from "./dashboard/dashboard";
import { DarkWebInsights } from "./dark-web-insights/dark-web-insights";
import { LoggedOutMonitoring } from "./logged-out-monitoring/logged-out-monitoring";
import GroupsRoutes from "./groups/routes";
import Members from "./members";
import membersReducer from "./members/member-actions/reducer";
import SettingsRoutes from "./settings/routes";
import IntegrationsRoutes from "./integrations/routes";
import { TacTabs } from "./types";
import teamReducer from "./reducer";
export function shouldRenderRouteForPermission(
  permissionLevelRequired: AdminPermissionLevel,
  userPermissions: PermissionChecker
): boolean {
  if (!userPermissions.adminAccess) {
    return true;
  }
  return userPermissions.adminAccess.hasPermissionLevel(
    permissionLevelRequired
  );
}
const routes = ({ basePath, path }: RoutesProps<string[]>): JSX.Element => {
  return (
    <WrappingRoute
      path={path}
      reducer={teamReducer}
      permission={(p) => p.loggedIn && p.adminAccess.hasTACAccess}
      redirectPath={LOGIN_URL_SEGMENT}
      component={Container}
    >
      <Switch>
        <Redirect
          exact
          from={`${basePath}/`}
          to={`${basePath}/${TacTabs.DASHBOARD}`}
        />
        <CustomRoute
          component={ChangePlan}
          path={`${basePath}/${TacTabs.CHANGE_PLAN}`}
          permission={(p) => shouldRenderRouteForPermission("BILLING", p)}
        />
        <CustomRoute
          component={PostTrialCheckout}
          path={`${basePath}/${TacTabs.POST_TRIAL_CHECKOUT}`}
          permission={(p) => shouldRenderRouteForPermission("BILLING", p)}
        />
        <CustomRoute
          component={AccountSummary}
          path={`${basePath}/${TacTabs.ACCOUNT}`}
          permission={(p) => shouldRenderRouteForPermission("BILLING", p)}
          redirectPath={`${basePath}/${TacTabs.GROUPS}`}
        />
        <CustomRoute
          component={Dashboard}
          path={`${basePath}/${TacTabs.DASHBOARD}`}
          permission={(p) => shouldRenderRouteForPermission("FULL", p)}
          redirectPath={`${basePath}/${TacTabs.ACCOUNT}`}
        />
        <ActivityRoutes path={`${basePath}/${TacTabs.ACTIVITY}`} />
        <GroupsRoutes
          path={`${basePath}/${TacTabs.GROUPS}`}
          permission={(p) => shouldRenderRouteForPermission("GROUP_READ", p)}
        />
        <CustomRoute
          component={Members}
          path={`${basePath}/${TacTabs.MEMBERS}`}
          permission={(p) => shouldRenderRouteForPermission("FULL", p)}
          redirectPath={`${basePath}/${TacTabs.ACCOUNT}`}
          reducer={membersReducer}
        />
        <CustomRoute
          component={DarkWebInsights}
          path={`${basePath}/${TacTabs.DARK_WEB_INSIGHTS}`}
          permission={(p) => shouldRenderRouteForPermission("FULL", p)}
          redirectPath={`${basePath}/${TacTabs.DARK_WEB_INSIGHTS}`}
          reducer={membersReducer}
        />
        <CustomRoute
          component={LoggedOutMonitoring}
          path={`${basePath}/${TacTabs.LOGGED_OUT_MONITORING}`}
          permission={(p) => shouldRenderRouteForPermission("FULL", p)}
          redirectPath={`${basePath}/${TacTabs.LOGGED_OUT_MONITORING}`}
        />
        <SettingsRoutes path={`${basePath}/${TacTabs.SETTINGS}`} />
        <IntegrationsRoutes path={`${basePath}/${TacTabs.INTEGRATIONS}`} />
      </Switch>
    </WrappingRoute>
  );
};
export default routes;
