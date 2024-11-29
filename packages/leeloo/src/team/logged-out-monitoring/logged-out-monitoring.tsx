import { useState } from "react";
import {
  Badge,
  Flex,
  Heading,
  IndeterminateLoader,
  Paragraph,
} from "@dashlane/design-system";
import { LoggedOutMonitoringFeatureFlips } from "@dashlane/risk-monitoring-contracts";
import { DataStatus, useFeatureFlips } from "@dashlane/framework-react";
import { useCapabilitiesEnabled } from "../../libs/carbon/hooks/useCapabilities";
import { useGetMassDeploymentTeamKeyAndActiveStatus } from "../../libs/hooks/use-get-mass-deployment-team-key-and-active-status";
import { useRouterGlobalSettingsContext } from "../../libs/router/RouterGlobalSettingsProvider";
import { useHistory } from "../../libs/router/dom";
import useTranslate from "../../libs/i18n/useTranslate";
import { useTeamTrialStatus } from "../../libs/hooks/use-team-trial-status";
import { LoggedOutMonitoringPreSetupPage } from "./logged-out-monitoring-pre-setup";
import { LoggedOutMonitoringSetupPage } from "./logged-out-monitoring-setup";
import { LOMoErrorCard } from "./components/lomo-error-card";
import { LoggedOutMonitoringPaywallPage } from "./logged-out-monitoring-paywall-page";
import { useIsBusinessPlus } from "../helpers/use-is-business-plus";
const LOMO_V2 = LoggedOutMonitoringFeatureFlips.RiskDetectionV2Prod;
const LOMO_V2_ON_DEMAND =
  LoggedOutMonitoringFeatureFlips.RiskDetectionV2OnDemand;
const I18N_KEYS = {
  PAGE_HEADER: "team_risk_detection_page_main_header",
  PAGE_HEADER_DESCRIPTION: "team_risk_detection_page_main_header_description",
  PAGE_HEADER_BADGE_BETA: "team_risk_detection_page_main_header_badge",
  BUSINESS_PLUS_BADGE_LABEL: "team_business_plus_badge_label",
  BUSINESS_PLUS_BADGE_EXPIRATION: "team_business_plus_badge_expiration",
};
export interface LoggedOutMonitoringErrorProps {
  hasError: boolean;
  retryFunction?: () => void;
}
export const LoggedOutMonitoring = () => {
  const hasRiskDetectionCapability = useCapabilitiesEnabled(["riskDetection"]);
  const features = useFeatureFlips();
  const { routes } = useRouterGlobalSettingsContext();
  const history = useHistory();
  const { translate } = useTranslate();
  const teamTrialStatus = useTeamTrialStatus();
  const isBusinessPlus = useIsBusinessPlus();
  const [error, setError] = useState<LoggedOutMonitoringErrorProps>({
    hasError: false,
    retryFunction: undefined,
  });
  const massDeploymentTeamKeyAndActiveStatusResult =
    useGetMassDeploymentTeamKeyAndActiveStatus();
  if (
    features.status === DataStatus.Loading ||
    massDeploymentTeamKeyAndActiveStatusResult.isLoading ||
    !teamTrialStatus
  ) {
    return (
      <Flex justifyContent="center">
        <IndeterminateLoader size={75} />
      </Flex>
    );
  }
  const hasOnDemandFF = !!features.data?.[LOMO_V2_ON_DEMAND];
  const hasV2FF = !!features.data?.[LOMO_V2];
  if (
    (!hasOnDemandFF && !hasV2FF) ||
    massDeploymentTeamKeyAndActiveStatusResult.hasError
  ) {
    history.push(routes.teamDashboardRoutePath);
    return null;
  }
  const { massDeploymentTeamKey, active } =
    massDeploymentTeamKeyAndActiveStatusResult;
  const shouldSeePaywall =
    hasV2FF && !hasRiskDetectionCapability && !hasOnDemandFF;
  return (
    <>
      <div
        sx={{
          px: "48px",
          pt: "32px",
          pb: "12px",
        }}
      >
        <Flex alignItems="center" gap="8px" sx={{ pb: "8px" }}>
          <Heading
            as="h1"
            textStyle="ds.title.section.large"
            color="ds.text.neutral.catchy"
          >
            {translate(I18N_KEYS.PAGE_HEADER)}
          </Heading>
          {!shouldSeePaywall && !isBusinessPlus ? (
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
          {translate(I18N_KEYS.PAGE_HEADER_DESCRIPTION)}
        </Paragraph>
      </div>

      {shouldSeePaywall ? (
        <LoggedOutMonitoringPaywallPage />
      ) : error.hasError ? (
        <LOMoErrorCard
          retryFunction={() => {
            setError({ hasError: false });
          }}
        />
      ) : massDeploymentTeamKey ? (
        <LoggedOutMonitoringSetupPage
          token={massDeploymentTeamKey}
          active={!!active}
          setError={setError}
        />
      ) : (
        <LoggedOutMonitoringPreSetupPage
          setError={() =>
            setError({
              hasError: true,
              retryFunction: undefined,
            })
          }
        />
      )}
    </>
  );
};
