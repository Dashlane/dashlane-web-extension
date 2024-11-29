import { Button, ClickOrigin, UserClickEvent } from "@dashlane/hermes";
import {
  DataStatus,
  useFeatureFlip,
  useModuleQuery,
} from "@dashlane/framework-react";
import { siemApi } from "@dashlane/risk-monitoring-contracts";
import { confidentialSSOApi } from "@dashlane/sso-scim-contracts";
import { Card, Flex, IndeterminateLoader } from "@dashlane/design-system";
import { SpaceTier } from "@dashlane/team-admin-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logEvent } from "../../../libs/logs/logEvent";
import { LinkCard, LinkType } from "../components/layout/link-card";
import { ResponsiveMainSecondaryLayout } from "../components/layout/responsive-main-secondary-layout";
import { BackPageLayout } from "../components/layout/back-page-layout";
import { SplunkConfiguration } from "./splunk-configuration";
import { useTeamTrialStatus } from "../../../libs/hooks/use-team-trial-status";
import { SiemPaywall } from "./siem-paywall";
const I18N_KEYS = {
  HEADER: "team_settings_siem_header",
  HEADER_HELPER: "team_settings_siem_header_helper",
  HELP_CARD_HEADER: "team_settings_siem_help_card_header",
  HELP_CARD_DESCRIPTION: "team_settings_splunk_help_card_description",
  HELP_CARD_LINK: "team_settings_splunk_help_card_link",
  UPGRADE_BUSINESS_PLAN_BAGE: "account_summary_upgrade_content_business_badge",
};
export const SiemSettings = () => {
  const { translate } = useTranslate();
  const { data: siemConfiguration, status: siemStatus } = useModuleQuery(
    siemApi,
    "getSiemConfiguration"
  );
  const hasSelfSignedCertFF = useFeatureFlip(
    "setup_rollout_siem_self_signed_certificate"
  );
  const { data: ssoProvisioningState, status: ssoProvisioningStatus } =
    useModuleQuery(confidentialSSOApi, "ssoProvisioning");
  const teamTrialStatus = useTeamTrialStatus();
  const isInitDone =
    siemStatus === DataStatus.Success &&
    ssoProvisioningStatus === DataStatus.Success;
  if (!teamTrialStatus) {
    return null;
  }
  const hasSiemPaywall = teamTrialStatus.spaceTier !== SpaceTier.Business;
  return (
    <BackPageLayout
      title={translate(I18N_KEYS.HEADER)}
      paragraph={
        hasSiemPaywall ? undefined : translate(I18N_KEYS.HEADER_HELPER)
      }
      badge={
        hasSiemPaywall
          ? {
              label: translate(I18N_KEYS.UPGRADE_BUSINESS_PLAN_BAGE),
              mood: "brand",
              iconName: "PremiumOutlined",
              layout: "iconLeading",
            }
          : undefined
      }
    >
      <>
        {hasSiemPaywall ? <SiemPaywall /> : null}
        <ResponsiveMainSecondaryLayout
          sx={{ padding: "0 32px" }}
          fullWidth
          mainContent={
            siemStatus !== DataStatus.Success ||
            ssoProvisioningStatus !== DataStatus.Success ||
            hasSelfSignedCertFF === null ||
            !isInitDone ? (
              <Card>
                <Flex fullWidth justifyContent="center">
                  <IndeterminateLoader size={60} sx={{ padding: "16px" }} />
                </Flex>
              </Card>
            ) : (
              <SplunkConfiguration
                token={siemConfiguration.token ?? ""}
                instanceURL={siemConfiguration.instanceURL ?? ""}
                isSelfSignedCertificateAllowed={
                  siemConfiguration.isSelfSignedCertificateAllowed
                }
                active={siemConfiguration.active}
                isTeamAlreadyCreated={
                  ssoProvisioningState.global.isTeamProvisionedInNitro
                }
                hasSiemPaywall={hasSiemPaywall}
                hasSelfSignedCertFF={!!hasSelfSignedCertFF}
                ssoSolution={ssoProvisioningState.ssoSolution}
              />
            )
          }
          secondaryContent={
            <LinkCard
              heading={translate(I18N_KEYS.HELP_CARD_HEADER)}
              description={translate(I18N_KEYS.HELP_CARD_DESCRIPTION)}
              linkProps={{
                linkType: LinkType.ExternalLink,
                linkHref: "__REDACTED__",
                onClick: () => {
                  logEvent(
                    new UserClickEvent({
                      button: Button.SeeSetupGuide,
                      clickOrigin: ClickOrigin.NeedHelp,
                    })
                  );
                },
              }}
              linkText={translate(I18N_KEYS.HELP_CARD_LINK)}
            />
          }
        />
      </>
    </BackPageLayout>
  );
};
