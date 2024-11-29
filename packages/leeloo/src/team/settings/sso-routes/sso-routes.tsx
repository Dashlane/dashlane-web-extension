import { SpaceTier } from "@dashlane/team-admin-contracts";
import { confidentialSSOApi, SsoSolution } from "@dashlane/sso-scim-contracts";
import { useModuleQuery } from "@dashlane/framework-react";
import { Lee } from "../../../lee";
import { Redirect, Route, Switch, useRouteMatch } from "../../../libs/router";
import { NitroSSO } from "../nitro-sso/nitro-sso";
import { SsoWithEncryptionService } from "../sso-with-encryption-service/SsoWithEncryptionService";
import { SSOSettings } from "../sso/sso-settings";
import { ChooseSsoEntrypoint } from "./choose-sso-entrypoint/choose-sso-entrypoint";
import { SSOPaywall } from "../sso/paywall/sso-paywall";
import { useBuyOrUpgradePaywallDetails } from "../../helpers/use-buy-or-upgrade-paywall-details";
export const TeamSsoRoutes = {
  SSO_CONNECTOR: "/sso-connector",
  SELF_HOSTED_SSO: "/self-hosted-sso",
  CONFIDENTIAL_SSO: "/confidential-sso",
  UPGRADE_PAYWALL: "/paywall",
};
export const SsoRoutes = ({ lee }: { lee: Lee }) => {
  const routeMatch = useRouteMatch();
  const { data: ssoState } = useModuleQuery(
    confidentialSSOApi,
    "ssoProvisioning"
  );
  const ssoSolution = ssoState?.ssoSolution;
  const isSelfHostedDisable =
    ssoSolution === SsoSolution.enum.confidentialSaml ||
    ssoSolution === SsoSolution.enum.ssoConnector;
  const isConfidentialDisabled =
    ssoSolution === SsoSolution.enum.selfHostedSaml ||
    ssoSolution === SsoSolution.enum.ssoConnector;
  const { shouldShowBuyOrUpgradePaywall, isTrialOrGracePeriod, planType } =
    useBuyOrUpgradePaywallDetails(lee.permission.adminAccess) ?? {};
  const isStandardPlan = planType === SpaceTier.Standard;
  const showUpgradePaywall =
    shouldShowBuyOrUpgradePaywall &&
    (planType === SpaceTier.Starter ||
      planType === SpaceTier.Team ||
      isStandardPlan);
  return (
    <Switch>
      <Route path={`${routeMatch.path}${TeamSsoRoutes.SELF_HOSTED_SSO}`}>
        {isSelfHostedDisable ? (
          <Redirect to={routeMatch.path} />
        ) : (
          <SsoWithEncryptionService backRoute={routeMatch.url} />
        )}
      </Route>
      <Route path={`${routeMatch.path}${TeamSsoRoutes.CONFIDENTIAL_SSO}`}>
        {isConfidentialDisabled ? (
          <Redirect to={routeMatch.path} />
        ) : (
          <NitroSSO backRoute={routeMatch.url} />
        )}
      </Route>
      <Route path={`${routeMatch.path}${TeamSsoRoutes.UPGRADE_PAYWALL}`}>
        <SSOPaywall isTrialOrGracePeriod={isTrialOrGracePeriod ?? false} />
      </Route>
      <Route path={`${routeMatch.path}${TeamSsoRoutes.SSO_CONNECTOR}`}>
        <SSOSettings lee={lee} />
      </Route>
      <Route exact path={routeMatch.path}>
        {showUpgradePaywall ? (
          <Redirect to={`${routeMatch.path}${TeamSsoRoutes.UPGRADE_PAYWALL}`} />
        ) : (
          <ChooseSsoEntrypoint />
        )}
      </Route>
    </Switch>
  );
};
