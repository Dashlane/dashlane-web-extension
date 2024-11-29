import { z } from "zod";
import { Paragraph } from "@dashlane/design-system";
import { IntegrationCardEnabled } from "./components/integration-card-enabled";
import useTranslate from "../../libs/i18n/useTranslate";
import { useRouterGlobalSettingsContext } from "../../libs/router";
import { TeamIntegrationsRoutes } from "../../app/routes/constants";
import { IntegrationCardSCIM } from "./components/integration-card-scim";
import {
  ProvisioningSolution,
  SsoSolution,
  SsoStatus,
} from "@dashlane/sso-scim-contracts";
import { TeamScimRoutes } from "../settings/directory-sync/routes";
const I18N_KEYS = {
  INTEGRATIONS_SCIM_TITLE: "team_integrations_scim_title",
  INTEGRATIONS_CONFIDENTIAL_PROVISIONING: "team_integrations_confidential_scim",
  INTEGRATIONS_SELF_HOSTED_SCIM: "team_integrations_self_hosted_scim",
  INTEGRATIONS_ACTIVE_DIRECTORY: "team_integrations_active_directory",
  INTEGRATIONS_SCIM_BADGE: "team_integrations_scim_badge",
};
interface Props {
  isCapable: boolean;
  ssoSolution: z.infer<typeof SsoSolution>;
  ssoStatus: z.infer<typeof SsoStatus>;
  provisioningSolution: z.infer<typeof ProvisioningSolution>;
}
export const IntegrationsScim = ({
  isCapable,
  ssoSolution,
  ssoStatus,
  provisioningSolution,
}: Props) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const isConfidential =
    ssoSolution === SsoSolution.enum.confidentialSaml ||
    provisioningSolution !== ProvisioningSolution.enum.selfHostedScim;
  const isLegacy =
    ssoSolution === SsoSolution.enum.ssoConnector ||
    provisioningSolution === ProvisioningSolution.enum.adSync;
  const isSelfHosted = !isConfidential && !isLegacy;
  const enabledSCIMOption = () => {
    return (
      <Paragraph>
        {provisioningSolution === ProvisioningSolution.enum.confidentialScim
          ? translate(I18N_KEYS.INTEGRATIONS_CONFIDENTIAL_PROVISIONING)
          : provisioningSolution === ProvisioningSolution.enum.selfHostedScim
          ? translate(I18N_KEYS.INTEGRATIONS_SELF_HOSTED_SCIM)
          : translate(I18N_KEYS.INTEGRATIONS_ACTIVE_DIRECTORY)}
      </Paragraph>
    );
  };
  return provisioningSolution === ProvisioningSolution.enum.none ? (
    <IntegrationCardSCIM
      isCapable={isCapable}
      ssoSolution={ssoSolution}
      ssoStatus={ssoStatus}
    />
  ) : (
    <IntegrationCardEnabled
      containerTitle={translate(I18N_KEYS.INTEGRATIONS_SCIM_TITLE)}
      subCardTitle={enabledSCIMOption()}
      editButtonLink={`${routes.teamIntegrationsRoutePath}${
        TeamIntegrationsRoutes.DIRECTORY_SYNC
      }${
        isConfidential
          ? TeamScimRoutes.CONFIDENTIAL_SCIM
          : isSelfHosted
          ? TeamScimRoutes.SELF_HOSTED_SCIM
          : TeamScimRoutes.ACTIVE_DIRECTORY
      }`}
      badgeLabel={translate(I18N_KEYS.INTEGRATIONS_SCIM_BADGE)}
    />
  );
};
