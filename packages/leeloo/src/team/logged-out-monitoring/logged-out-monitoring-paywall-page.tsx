import { useEffect, useState } from "react";
import { Badge, Button, Flex, Heading } from "@dashlane/design-system";
import { Card } from "@dashlane/ui-components";
import {
  Button as HermesButton,
  PageView,
  UserClickEvent,
} from "@dashlane/hermes";
import useTranslate from "../../libs/i18n/useTranslate";
import { useTeamBillingInformation } from "../../libs/hooks/use-team-billing-information";
import { logEvent, logPageView } from "../../libs/logs/logEvent";
import { ContactSupportDialog } from "../page/support/contact-support-dialog";
import { ResponsiveMainSecondaryLayout } from "../settings/components/layout/responsive-main-secondary-layout";
import { LOMoFeatureDescription } from "./components/feature-description";
import { ContactUsSecondaryCard } from "./components/contact-us-card";
import {
  FeatureType,
  openBusinessUpgradeUrl,
} from "../helpers/open-business-upgrade-url";
import { useTeamTrialStatus } from "../../libs/hooks/use-team-trial-status";
const I18N_KEYS = {
  BADGE: "team_risk_detection_paywall_premium_badge",
  MAIN_CARD_TITLE: "team_risk_detection_paywall_main_card_title",
  MAIN_CARD_CREDENTIAL_RISK_TITLE:
    "team_risk_detection_paywall_main_card_credential_risk_title",
  MAIN_CARD_CREDENTIAL_RISK_SUBTITLE:
    "team_risk_detection_paywall_main_card_credential_risk_subtitle",
  MAIN_CARD_RECEIVE_ALERTS_TITLE:
    "team_risk_detection_paywall_main_card_receive_alert_title",
  MAIN_CARD_RECEIVE_ALERTS_SUBTITLE:
    "team_risk_detection_paywall_main_card_receive_alert_subtitle",
  MAIN_CARD_TAKE_ACTION_TITLE:
    "team_risk_detection_paywall_main_card_take_action_title",
  MAIN_CARD_TAKE_ACTION_SUBTITLE:
    "team_risk_detection_paywall_main_card_take_action_subtitle",
  MAIN_CARD_UPGRADE_BUSINESS_BUTTON:
    "team_risk_detection_paywall_main_card_upgrade_business_button",
};
export const LoggedOutMonitoringPaywallPage = () => {
  const { translate } = useTranslate();
  const teamBillingInformation = useTeamBillingInformation();
  const teamTrialStatus = useTeamTrialStatus();
  const [supportDialogIsOpen, setSupportDialogIsOpen] = useState(false);
  const openSupportDialog = () => setSupportDialogIsOpen(true);
  useEffect(() => {
    logPageView(PageView.TacRiskDetectionPaywall);
  }, []);
  if (!teamTrialStatus) {
    return null;
  }
  const isTrialOrGracePeriod =
    teamTrialStatus.isFreeTrial || teamTrialStatus.isGracePeriod;
  const handleClickUpgradeToBusinessPlus = () => {
    logEvent(
      new UserClickEvent({
        button: HermesButton.UpgradeBusinessPlusTier,
      })
    );
    openBusinessUpgradeUrl(
      FeatureType.CRD,
      teamBillingInformation?.spaceTier,
      isTrialOrGracePeriod
    );
  };
  return (
    <>
      <ResponsiveMainSecondaryLayout
        mainContent={
          <Card
            sx={{
              display: "flex",
              padding: "48px",
              backgroundColor: "ds.container.agnostic.neutral.supershy",
              borderColor: "ds.border.neutral.quiet.idle",
            }}
          >
            <Flex flexDirection="column" gap="32px">
              <Flex flexDirection="column" gap="8px">
                <Badge
                  mood="brand"
                  intensity="quiet"
                  layout="iconLeading"
                  label={translate(I18N_KEYS.BADGE)}
                  iconName="PremiumOutlined"
                />
                <Heading
                  as="h2"
                  color="ds.text.neutral.catchy"
                  textStyle="ds.title.section.large"
                  sx={{ letterSpacing: "-1px" }}
                >
                  {translate(I18N_KEYS.MAIN_CARD_TITLE)}
                </Heading>
              </Flex>
              <Flex flexDirection="column" alignItems="left" gap="32px">
                <LOMoFeatureDescription
                  iconName="ProtectionOutlined"
                  title={translate(I18N_KEYS.MAIN_CARD_CREDENTIAL_RISK_TITLE)}
                  description={translate(
                    I18N_KEYS.MAIN_CARD_CREDENTIAL_RISK_SUBTITLE
                  )}
                />
                <LOMoFeatureDescription
                  iconName="RiskDetectionOutlined"
                  title={translate(I18N_KEYS.MAIN_CARD_RECEIVE_ALERTS_TITLE)}
                  description={translate(
                    I18N_KEYS.MAIN_CARD_RECEIVE_ALERTS_SUBTITLE
                  )}
                />
                <LOMoFeatureDescription
                  iconName="TipOutlined"
                  title={translate(I18N_KEYS.MAIN_CARD_TAKE_ACTION_TITLE)}
                  description={translate(
                    I18N_KEYS.MAIN_CARD_TAKE_ACTION_SUBTITLE
                  )}
                />
              </Flex>
              <Flex justifyContent="right">
                <Button
                  size="medium"
                  layout="iconLeading"
                  icon="PremiumOutlined"
                  onClick={handleClickUpgradeToBusinessPlus}
                >
                  {translate(I18N_KEYS.MAIN_CARD_UPGRADE_BUSINESS_BUTTON)}
                </Button>
              </Flex>
            </Flex>
          </Card>
        }
        fullWidth
        secondaryContent={
          <ContactUsSecondaryCard onClick={openSupportDialog} />
        }
      />
      {supportDialogIsOpen ? (
        <ContactSupportDialog onDismiss={() => setSupportDialogIsOpen(false)} />
      ) : null}
    </>
  );
};
