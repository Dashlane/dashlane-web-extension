import { z } from "zod";
import { Heading, Icon, Paragraph } from "@dashlane/design-system";
import employeeOnBoarding from "@dashlane/design-system/assets/illustrations/seamless-employee-onboarding-and-offboarding@2x-light.webp";
import { SsoSolution, SsoStatus } from "@dashlane/sso-scim-contracts";
import { TeamIntegrationsRoutes } from "../../../app/routes/constants";
import { useRouterGlobalSettingsContext } from "../../../libs/router";
import { confidentialSCIM } from "../../../team/settings/directory-sync/directory-sync-landing-page/card-info";
import { IntegrationCard } from "./integration-card";
import useTranslate from "../../../libs/i18n/useTranslate";
interface Props {
  isCapable: boolean;
  ssoSolution: z.infer<typeof SsoSolution>;
  ssoStatus: z.infer<typeof SsoStatus>;
}
const I18N_KEYS = {
  SCIM_TITLE: "team_integrations_scim_title",
  SCIM_SUBCARD_DESCRIPTION: "team_integrations_scim_subcard_description",
  SCIM_LINK_TITLE: "team_integrations_mass_deployment_link",
  SCIM_DISABLED_REASON: "team_integrations_scim_disabled_reason",
  SCIM_MAIN_BUTTON: "team_integrations_scim_main_button",
  SCIM_SECOND_BUTTON: "team_integrations_scim_second_button",
  SCIM_BADGE: "team_integrations_scim_badge",
  SCIM_CONFIDENTIAL: "team_integrations_confidential_scim",
  MINUTES: "team_integrations_time",
};
const HELP_CENTER_LINK = "__REDACTED__";
const SubCardTitle = () => {
  const { translate } = useTranslate();
  return (
    <div sx={{ display: "flex", gap: "8px" }}>
      <Heading
        as="h3"
        textStyle="ds.title.block.medium"
        color="ds.text.neutral.catchy"
      >
        {translate(I18N_KEYS.SCIM_CONFIDENTIAL)}
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
          5 {translate(I18N_KEYS.MINUTES)}
        </Paragraph>
      </div>
    </div>
  );
};
export const IntegrationCardSCIM = ({
  isCapable,
  ssoSolution,
  ssoStatus,
}: Props) => {
  const { routes } = useRouterGlobalSettingsContext();
  const { translate } = useTranslate();
  const isConfidential =
    ssoSolution === SsoSolution.enum.confidentialSaml &&
    ssoStatus === SsoStatus.enum.enabled;
  return (
    <IntegrationCard
      containerTitle={translate(I18N_KEYS.SCIM_TITLE)}
      subCardHeader={<SubCardTitle />}
      subCardDescription={translate(I18N_KEYS.SCIM_SUBCARD_DESCRIPTION)}
      image={employeeOnBoarding}
      externalLink={HELP_CENTER_LINK}
      externalLinkTitle={translate(I18N_KEYS.SCIM_LINK_TITLE)}
      isMainButtonDisabled={!isConfidential}
      disabledReason={translate(I18N_KEYS.SCIM_DISABLED_REASON)}
      mainButtonTitle={translate(I18N_KEYS.SCIM_MAIN_BUTTON)}
      mainButtonLink={`${routes.teamIntegrationsRoutePath}${TeamIntegrationsRoutes.DIRECTORY_SYNC}${confidentialSCIM.redirectUrl}`}
      secondButtonTitle={translate(I18N_KEYS.SCIM_SECOND_BUTTON)}
      secondButtonLink={`${routes.teamIntegrationsRoutePath}${TeamIntegrationsRoutes.DIRECTORY_SYNC}`}
      badgeLabel={translate(I18N_KEYS.SCIM_BADGE)}
      upgradeButtonLink={`${routes.teamAccountChangePlanRoutePath}?plan=business`}
      isCapable={isCapable}
    />
  );
};
