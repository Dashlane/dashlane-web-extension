import * as React from "react";
import { CustomRoute, Redirect, Route } from "../../libs/router";
import {
  Alias as AliasDeeplinkRedirect,
  buildClientProps as buildAliasDeeplinkRedirectProps,
} from "../../libs/redirect/deeplink/alias";
import {
  ACCOUNT_CREATION_TAC_URL_SEGMENT,
  ACCOUNT_CREATION_URL_SEGMENT,
  ACCOUNT_RECOVERY_KEY_RESULT_SEGMENT,
  ACCOUNT_RECOVERY_URL_SEGMENT,
  AUTO_SSO_LOGIN_SUCCESS_URL_SEGMENT,
  CHANGE_LOGIN_EMAIL_SEGMENT,
  DELETE_ACCOUNT_URL_SEGMENT,
  DEPENDENCIES_URL_SEGMENT,
  DEVICE_TRANSFER_SUCCESS_SEGMENT,
  EMPLOYEE_ACCOUNT_CREATION_URL_SEGMENT,
  FAMILY_URL_SEGMENT,
  LOADER_URL_SEGMENT,
  LOGIN_TAC_URL_SEGMENT,
  LOGIN_URL_SEGMENT,
  RECOVER_2FA_CODES_URL_SEGMENT,
  RESET_ACCOUNT_URL_SEGMENT,
  RoutingSchemeOptions,
  SSO_URL_SEGMENT,
} from "./constants";
import { Dependencies } from "../../dependencies/dependencies";
import { SsoProxy } from "../../sso/sso-proxy";
import AccountRecoveryRoutes from "../../account-recovery/routes";
import { MarketingContentType } from "../../auth/auth";
import { AccountCreationRoutes } from "../../account-creation/routes";
import AuthRoutes from "../../auth/routes";
import WebAppRoutes from "../../webapp/routes";
import { NamedRoutes, RoutingConfig } from "./types";
import FamilyRoutes from "../../family/routes";
import { RootSwitch } from "./routes-common";
import { getAllWebAppRoutes } from "./helpers";
import { FullPageLoader } from "../../loader/FullPageLoader";
import { AccountRecoveryKeyResult } from "../../account-recovery/account-recovery-key/steps/recovery-result";
import { AutoSsoSuccess } from "../../auth/login-panel/authentication-flow/steps";
import { DeviceTransferSuccess } from "../../auth/login-panel/authentication-flow/steps/device-to-device-authentication/components/device-transfer-success";
import { Recover2FaCodes } from "../../auth/recover-2fa-codes/recover-2fa-codes";
import { DeleteOrResetAccount } from "../../delete-or-reset-account/delete-or-reset-account";
import { ChangeLoginEmailContainer } from "../../account-management/change-login-email/change-login-email-container";
const CLIENT_ROUTING_CONFIG: RoutingConfig = {
  scheme: RoutingSchemeOptions.CLIENT,
  getRoutes: (namedRoute: NamedRoutes): JSX.Element => {
    const path = namedRoute.clientRoutesBasePath;
    return (
      <RootSwitch>
        <Redirect exact from="/" to={`${path}/credentials`} />
        <Route
          path={RECOVER_2FA_CODES_URL_SEGMENT}
          component={Recover2FaCodes}
        />
        <AccountCreationRoutes
          path={[
            ACCOUNT_CREATION_TAC_URL_SEGMENT,
            ACCOUNT_CREATION_URL_SEGMENT,
            EMPLOYEE_ACCOUNT_CREATION_URL_SEGMENT,
          ]}
        />
        <AuthRoutes
          path={[LOGIN_TAC_URL_SEGMENT]}
          options={{
            marketingContentType: MarketingContentType.DashlaneBusiness,
          }}
        />
        <AuthRoutes path={[LOGIN_URL_SEGMENT]} />
        <CustomRoute path={SSO_URL_SEGMENT} component={SsoProxy} />
        <AccountRecoveryRoutes path={ACCOUNT_RECOVERY_URL_SEGMENT} />
        <CustomRoute
          path={ACCOUNT_RECOVERY_KEY_RESULT_SEGMENT}
          component={AccountRecoveryKeyResult}
        />
        <CustomRoute
          path={AUTO_SSO_LOGIN_SUCCESS_URL_SEGMENT}
          component={AutoSsoSuccess}
        />
        <CustomRoute
          path={DEVICE_TRANSFER_SUCCESS_SEGMENT}
          component={DeviceTransferSuccess}
        />
        <CustomRoute
          path={CHANGE_LOGIN_EMAIL_SEGMENT}
          component={ChangeLoginEmailContainer}
        />
        <FamilyRoutes path={FAMILY_URL_SEGMENT} />
        <CustomRoute path={DEPENDENCIES_URL_SEGMENT} component={Dependencies} />
        <CustomRoute path={LOADER_URL_SEGMENT} component={FullPageLoader} />
        <CustomRoute
          path={DELETE_ACCOUNT_URL_SEGMENT}
          component={DeleteOrResetAccount}
          additionalProps={{ isDelete: true }}
        />
        <CustomRoute
          path={RESET_ACCOUNT_URL_SEGMENT}
          component={DeleteOrResetAccount}
          additionalProps={{ isDelete: false }}
        />
        <AliasDeeplinkRedirect {...buildAliasDeeplinkRedirectProps(path)} />
        <WebAppRoutes
          routingSchemeOptions={CLIENT_ROUTING_CONFIG.scheme}
          basePath={path}
          path={[...getAllWebAppRoutes(path)]}
        />
      </RootSwitch>
    );
  },
};
export default CLIENT_ROUTING_CONFIG;
