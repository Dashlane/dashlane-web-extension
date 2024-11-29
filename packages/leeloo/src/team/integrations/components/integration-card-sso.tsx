import { z } from "zod";
import { Heading, Icon, Paragraph } from "@dashlane/design-system";
import SSOIntegration from "@dashlane/design-system/assets/illustrations/SCIM-SSO-integration-easy-for-businessess@2x-light.webp";
import { ProvisioningSolution } from "@dashlane/sso-scim-contracts";
import { TeamIntegrationsRoutes } from "../../../app/routes/constants";
import { useRouterGlobalSettingsContext } from "../../../libs/router";
import { TeamSsoRoutes } from "../../../team/settings/sso-routes/sso-routes";
import { IntegrationCard } from "./integration-card";
import useTranslate from "../../../libs/i18n/useTranslate";
interface Props {
  isCapable: boolean;
  provisioningSolution: z.infer<typeof ProvisioningSolution>;
}
const I18N_KEYS = {
  SSO_TITLE: "team_integrations_sso_card_title",
  SSO_SUBCARD_TITLE: "team_integrations_sso_subcard_title",
  SSO_SUBCARD_DESCRIPTION: "team_integrations_sso_subcard_description",
  SSO_LINK_TITLE: "team_integrations_mass_deployment_link",
  SSO_SETUP: "team_integrations_scim_main_button",
  SSO_SEE_OTHER: "team_integrations_scim_second_button",
  SSO_BADGE: "team_integrations_sso_badge",
  SSO_DISABLED_REASON: "team_integrations_sso_disabled",
  MINUTES: "team_integrations_time",
};
const SubCardTitle = () => {
  const { translate } = useTranslate();
  return (
    <div sx={{ display: "flex", gap: "8px" }}>
      <Heading
        as="h3"
        textStyle="ds.title.block.medium"
        color="ds.text.neutral.catchy"
      >
        {translate(I18N_KEYS.SSO_SUBCARD_TITLE)}
      </Heading>

      <div sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <Icon
          name="TimeOutlined"
          size="xsmall"
          color="ds.text.neutral.standard"
        />
        <Paragraph
          color="ds.text.neutral.standard"
          textStyle="ds.body.helper.regular"
        >
          10 {translate(I18N_KEYS.MINUTES)}
        </Paragraph>
      </div>
    </div>
  );
};
export const IntegrationCardSSO = ({
  isCapable,
  provisioningSolution,
}: Props) => {
  const { routes } = useRouterGlobalSettingsContext();
  const { translate } = useTranslate();
  return (
    <IntegrationCard
      containerTitle={translate(I18N_KEYS.SSO_TITLE)}
      subCardHeader={<SubCardTitle />}
      subCardDescription={translate(I18N_KEYS.SSO_SUBCARD_DESCRIPTION)}
      image={SSOIntegration}
      externalLink="__REDACTED__"
      externalLinkTitle={translate(I18N_KEYS.SSO_LINK_TITLE)}
      isMainButtonDisabled={
        provisioningSolution === ProvisioningSolution.enum.selfHostedScim
      }
      disabledReason={translate(I18N_KEYS.SSO_DISABLED_REASON)}
      mainButtonTitle={translate(I18N_KEYS.SSO_SETUP)}
      mainButtonLink={`${routes.teamIntegrationsRoutePath}${TeamIntegrationsRoutes.SSO}${TeamSsoRoutes.CONFIDENTIAL_SSO}`}
      secondButtonTitle={translate(I18N_KEYS.SSO_SEE_OTHER)}
      secondButtonLink={`${routes.teamIntegrationsRoutePath}${TeamIntegrationsRoutes.SSO}`}
      badgeLabel={translate(I18N_KEYS.SSO_BADGE)}
      upgradeButtonLink={`${routes.teamAccountChangePlanRoutePath}?plan=business`}
      isCapable={isCapable}
    />
  );
};
