import { z } from "zod";
import { Badge, Heading, Icon, Paragraph } from "@dashlane/design-system";
import seamlessSyncingAccessIllustration from "@dashlane/design-system/assets/illustrations/seamless-syncing-access-data-anywhere@2x-light.webp";
import {
  Button,
  ClickOrigin,
  HelpCenterArticleCta,
  UserClickEvent,
  UserOpenHelpCenterEvent,
} from "@dashlane/hermes";
import { SpaceTier } from "@dashlane/team-admin-contracts";
import { useFeatureFlip } from "@dashlane/framework-react";
import useTranslate from "../../libs/i18n/useTranslate";
import { useRouterGlobalSettingsContext } from "../../libs/router";
import { TeamIntegrationsRoutes } from "../../app/routes/constants";
import { IntegrationCard } from "./components/integration-card";
import { IntegrationCardEnabled } from "./components/integration-card-enabled";
import { logEvent } from "../../libs/logs/logEvent";
import { useTeamTrialStatus } from "../../libs/hooks/use-team-trial-status";
import { SsoSolution } from "@dashlane/sso-scim-contracts";
const I18N_KEYS = {
  SIEM_TITLE: "team_integrations_siem_title",
  SIEM_SUBTITLE: "team_integrations_siem_subtitle",
  SIEM_SUBDESCRIPTION: "team_integrations_siem_subdescription",
  SIEM_BADGE: "team_integrations_siem_badge",
  SIEM_COMING_SOON_TITLE: "team_integrations_siem_coming_soon",
  SIEM_UNAVAILABLE_SUBDESCRIPTION:
    "team_integrations_siem_unavailable_subdescription",
  SPLUNK_NON_ACTIVE_TITLE: "team_integrations_splunk_non_active_title",
  SPLUNK_NON_ACTIVE_SUBTITLE: "team_integrations_splunk_non_active_subtitle",
  SPLUNK_NON_ACTIVE_LINK_TITLE: "team_integrations_splunk_non_active_link",
  SPLUNK_NON_ACTIVE_MAIN_BUTTON:
    "team_integrations_splunk_non_active_main_button",
  MINUTES: "team_integrations_time",
  SPLUNK_ACTIVE_TITLE: "team_integrations_splunk_active_title",
};
interface IntegrationCardSIEMProps {
  active: boolean;
  ssoSolution: z.infer<typeof SsoSolution>;
}
export const IntegrationsSIEM = ({
  active,
  ssoSolution,
}: IntegrationCardSIEMProps) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const hasSiemIntegrationFF = useFeatureFlip(
    "setup_rollout_splunk_integration_prod"
  );
  const isSiemCompatible =
    ssoSolution === SsoSolution.enum.none ||
    ssoSolution === SsoSolution.enum.confidentialSaml;
  const hasSiemIntegrationAccess = hasSiemIntegrationFF && isSiemCompatible;
  const hasSiemPaywall = useTeamTrialStatus()?.spaceTier === SpaceTier.Business;
  const SIEM_SETTINGS_ROUTE = `${routes.teamIntegrationsRoutePath}${TeamIntegrationsRoutes.SIEM}`;
  if (!hasSiemIntegrationAccess) {
    return (
      <IntegrationCard
        containerTitle={translate(I18N_KEYS.SIEM_TITLE)}
        subCardHeader={
          <div sx={{ display: "flex", gap: "8px" }}>
            <Heading
              as="h3"
              textStyle="ds.title.block.medium"
              color="ds.text.neutral.catchy"
            >
              {translate(I18N_KEYS.SIEM_SUBTITLE)}
            </Heading>

            {!hasSiemIntegrationFF ? (
              <Badge
                label={translate(I18N_KEYS.SIEM_COMING_SOON_TITLE)}
                layout="labelOnly"
                intensity="catchy"
                mood="brand"
              />
            ) : null}
          </div>
        }
        subCardDescription={
          !hasSiemIntegrationFF
            ? translate(I18N_KEYS.SIEM_SUBDESCRIPTION)
            : translate(I18N_KEYS.SIEM_UNAVAILABLE_SUBDESCRIPTION)
        }
        badgeLabel={translate(I18N_KEYS.SIEM_BADGE)}
        isCapable={false}
      />
    );
  }
  if (active) {
    return (
      <IntegrationCardEnabled
        containerTitle={translate(I18N_KEYS.SIEM_TITLE)}
        subCardTitle={
          <Heading
            as="h3"
            textStyle="ds.title.block.medium"
            color="ds.text.neutral.catchy"
          >
            {translate(I18N_KEYS.SPLUNK_ACTIVE_TITLE)}
          </Heading>
        }
        badgeLabel={translate(I18N_KEYS.SIEM_BADGE)}
        editButtonLink={SIEM_SETTINGS_ROUTE}
      />
    );
  }
  return (
    <IntegrationCard
      containerTitle={translate(I18N_KEYS.SIEM_TITLE)}
      subCardHeader={
        <div sx={{ display: "flex", gap: "8px" }}>
          <Heading
            as="h3"
            textStyle="ds.title.block.medium"
            color="ds.text.neutral.catchy"
          >
            {translate(I18N_KEYS.SPLUNK_NON_ACTIVE_TITLE)}
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
      }
      subCardDescription={translate(I18N_KEYS.SPLUNK_NON_ACTIVE_SUBTITLE)}
      badgeLabel={translate(I18N_KEYS.SIEM_BADGE)}
      externalLink="__REDACTED__"
      externalLinkTitle={translate(I18N_KEYS.SPLUNK_NON_ACTIVE_LINK_TITLE)}
      externalLinkOnClick={() =>
        logEvent(
          new UserOpenHelpCenterEvent({
            helpCenterArticleCta:
              HelpCenterArticleCta.LearnAboutSplunkIntegration,
          })
        )
      }
      image={seamlessSyncingAccessIllustration}
      mainButtonTitle={translate(I18N_KEYS.SPLUNK_NON_ACTIVE_MAIN_BUTTON)}
      mainButtonLink={SIEM_SETTINGS_ROUTE}
      mainButtonOnClick={() =>
        logEvent(
          new UserClickEvent({
            button: Button.SetUp,
            clickOrigin: ClickOrigin.SplunkIntegration,
          })
        )
      }
      isCapable={hasSiemPaywall}
      upgradeButtonLink={`${routes.teamAccountChangePlanRoutePath}?plan=business`}
    />
  );
};
