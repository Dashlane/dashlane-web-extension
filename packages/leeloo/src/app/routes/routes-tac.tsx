import { CustomRoute, Route } from "../../libs/router";
import { Dependencies } from "../../dependencies/dependencies";
import { MarketingContentType } from "../../auth/auth";
import { AccountCreationRoutes } from "../../account-creation/routes";
import AuthRoutes from "../../auth/routes";
import TeamRoutes from "../../team/routes";
import {
  ACCOUNT_CREATION_URL_SEGMENT,
  DEPENDENCIES_URL_SEGMENT,
  LOGIN_URL_SEGMENT,
  RECOVER_2FA_CODES_URL_SEGMENT,
  RoutingSchemeOptions,
  SSO_URL_SEGMENT,
} from "./constants";
import { NamedRoutes, RoutingConfig } from "./types";
import { SsoProxy } from "../../sso/sso-proxy";
import { RootSwitch } from "./routes-common";
import { TacTabs } from "../../team/types";
import { Recover2FaCodes } from "../../auth/recover-2fa-codes/recover-2fa-codes";
const TAC_ROUTING_CONFIG: RoutingConfig = {
  scheme: RoutingSchemeOptions.TEAM_ADMIN_CONSOLE,
  getRoutes: (nr: NamedRoutes): JSX.Element => {
    const path = nr.teamRoutesBasePath;
    return (
      <RootSwitch>
        <Route
          path={RECOVER_2FA_CODES_URL_SEGMENT}
          component={Recover2FaCodes}
        />

        <AccountCreationRoutes path={[ACCOUNT_CREATION_URL_SEGMENT]} />
        <AuthRoutes
          path={[LOGIN_URL_SEGMENT]}
          options={{
            marketingContentType: MarketingContentType.DashlaneBusiness,
            requiredPermissions: "BILLING",
          }}
        />
        <CustomRoute path={DEPENDENCIES_URL_SEGMENT} component={Dependencies} />
        <CustomRoute path={SSO_URL_SEGMENT} component={SsoProxy} />
        <TeamRoutes
          basePath={path}
          path={[
            path,
            `${path}/${TacTabs.ACCOUNT}`,
            `${path}/${TacTabs.ACTIVITY}`,
            `${path}/${TacTabs.DASHBOARD}`,
            `${path}/${TacTabs.GROUPS}`,
            `${path}/${TacTabs.MEMBERS}`,
            `${path}/${TacTabs.SETTINGS}`,
            `${path}/${TacTabs.DARK_WEB_INSIGHTS}`,
            `${path}/${TacTabs.LOGGED_OUT_MONITORING}`,
          ]}
        />
      </RootSwitch>
    );
  },
};
export default TAC_ROUTING_CONFIG;
