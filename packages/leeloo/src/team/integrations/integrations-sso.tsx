import { z } from "zod";
import { Paragraph } from "@dashlane/design-system";
import {
  ProvisioningSolution,
  SsoSolution,
  SsoStatus,
} from "@dashlane/sso-scim-contracts";
import { IntegrationCardEnabled } from "./components/integration-card-enabled";
import { IntegrationCardSSO } from "./components/integration-card-sso";
import useTranslate from "../../libs/i18n/useTranslate";
import { TeamIntegrationsRoutes } from "../../app/routes/constants";
import { TeamSsoRoutes } from "../settings/sso-routes/sso-routes";
import { useRouterGlobalSettingsContext } from "../../libs/router";
const I18N_KEYS = {
  INTEGRATIONS_SSO_TITLE: "team_integrations_sso_title",
  INTEGRATIONS_CONFIDENTIAL_SSO: "team_integrations_confidential_sso_title",
  INTEGRATIONS_SELF_HOSTED_SSO: "team_integrations_self_hosted_sso_title",
  INTEGRATIONS_SSO_BADGE: "team_integrations_sso_badge",
};
interface Props {
  isCapable: boolean;
  ssoSolution: z.infer<typeof SsoSolution>;
  ssoStatus: z.infer<typeof SsoStatus>;
  provisioningSolution: z.infer<typeof ProvisioningSolution>;
}
export const IntegrationsSSO = ({
  isCapable,
  provisioningSolution,
  ssoSolution,
  ssoStatus,
}: Props) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const isConfidential =
    ssoSolution === SsoSolution.enum.confidentialSaml ||
    provisioningSolution !== ProvisioningSolution.enum.selfHostedScim;
  const isSelfHosted =
    ssoSolution === SsoSolution.enum.selfHostedSaml ||
    provisioningSolution !== ProvisioningSolution.enum.confidentialScim;
  const enabledSSOOption = () => {
    return (
      <Paragraph>
        {ssoSolution === SsoSolution.enum.confidentialSaml
          ? translate(I18N_KEYS.INTEGRATIONS_CONFIDENTIAL_SSO)
          : translate(I18N_KEYS.INTEGRATIONS_SELF_HOSTED_SSO)}
      </Paragraph>
    );
  };
  return ssoStatus === SsoStatus.enum.enabled ? (
    <IntegrationCardEnabled
      containerTitle={translate(I18N_KEYS.INTEGRATIONS_SSO_TITLE)}
      subCardTitle={enabledSSOOption()}
      editButtonLink={`${routes.teamIntegrationsRoutePath}${
        TeamIntegrationsRoutes.SSO
      }${
        isConfidential
          ? TeamSsoRoutes.CONFIDENTIAL_SSO
          : isSelfHosted
          ? TeamSsoRoutes.SELF_HOSTED_SSO
          : TeamSsoRoutes.SSO_CONNECTOR
      }`}
      badgeLabel={translate(I18N_KEYS.INTEGRATIONS_SSO_BADGE)}
    />
  ) : (
    <IntegrationCardSSO
      isCapable={isCapable}
      provisioningSolution={provisioningSolution}
    />
  );
};
