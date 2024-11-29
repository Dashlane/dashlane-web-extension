import {
  Badge,
  Flex,
  Heading,
  IndeterminateLoader,
  Paragraph,
} from "@dashlane/design-system";
import { DataStatus, useFeatureFlip } from "@dashlane/framework-react";
import { useEffect } from "react";
import { AlertingErrorBoundary } from "../../../libs/error/alerting-error-boundary";
import useTranslate from "../../../libs/i18n/useTranslate";
import { useTeamTrialStatus } from "../../../libs/hooks/use-team-trial-status";
import { NudgesContent } from "./nudges-content";
import { redirect, useRouterGlobalSettingsContext } from "../../../libs/router";
import { useCapabilities } from "../../../libs/carbon/hooks/useCapabilities";
import { useIsBusinessPlus } from "../../helpers/use-is-business-plus";
const I18N_KEYS = {
  TITLE: "webapp_sidemenu_nudges",
  DESCRIPTION: "team_settings_nudges_description",
  BUSINESS_PLUS_BADGE_LABEL: "team_business_plus_badge_label",
  BUSINESS_PLUS_BADGE_EXPIRATION: "team_business_plus_badge_expiration",
};
export const NudgesSettings = () => {
  const hasNudgesFF = useFeatureFlip("ace_tac_slack_integration");
  const nudgesCapability = useCapabilities(["nudges"]);
  const { routes } = useRouterGlobalSettingsContext();
  const teamTrialStatus = useTeamTrialStatus();
  const isBusinessPlus = useIsBusinessPlus();
  const { translate } = useTranslate();
  useEffect(() => {
    if (hasNudgesFF === false || hasNudgesFF === undefined) {
      redirect(routes.teamIntegrationsRoutePath);
    }
  }, [hasNudgesFF]);
  if (hasNudgesFF === null || !teamTrialStatus) {
    return (
      <Flex justifyContent="center">
        <IndeterminateLoader size={75} />
      </Flex>
    );
  }
  const hasNudgesCapability =
    nudgesCapability.status === DataStatus.Success && nudgesCapability.data;
  return (
    <AlertingErrorBoundary moduleName="TAC" useCaseName="nudges">
      <div sx={{ padding: "24px 0" }}>
        <div
          sx={{
            pl: "32px",
            pb: "16px",
          }}
        >
          <Flex alignItems="center" gap="8px" sx={{ pb: "8px" }}>
            <Heading
              as="h1"
              textStyle="ds.title.section.large"
              color="ds.text.neutral.catchy"
            >
              {translate(I18N_KEYS.TITLE)}
            </Heading>
            {!isBusinessPlus && hasNudgesCapability ? (
              <>
                <Badge
                  label={translate(I18N_KEYS.BUSINESS_PLUS_BADGE_LABEL)}
                  mood="brand"
                  intensity="quiet"
                  layout="iconLeading"
                  iconName="PremiumOutlined"
                />
                {!teamTrialStatus.isFreeTrial ? (
                  <Paragraph
                    textStyle="ds.body.helper.regular"
                    color="ds.text.brand.standard"
                  >
                    {translate(I18N_KEYS.BUSINESS_PLUS_BADGE_EXPIRATION)}
                  </Paragraph>
                ) : null}
              </>
            ) : null}
          </Flex>
          <Paragraph color="ds.text.neutral.standard">
            {translate(I18N_KEYS.DESCRIPTION)}
          </Paragraph>
        </div>

        <NudgesContent />
      </div>
    </AlertingErrorBoundary>
  );
};
