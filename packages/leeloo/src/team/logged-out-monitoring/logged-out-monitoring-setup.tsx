import { useState } from "react";
import { Flex, Tabs } from "@dashlane/design-system";
import { GridContainer } from "@dashlane/ui-components";
import useTranslate from "../../libs/i18n/useTranslate";
import { ResponsiveMainSecondaryLayout } from "../settings/components/layout/responsive-main-secondary-layout";
import { UpsellCard } from "../components/upsell-card";
import { FeatureType } from "../helpers/open-business-upgrade-url";
import { useIsBusinessPlus } from "../helpers/use-is-business-plus";
import { LomoDeploymentStepsCard } from "./components/lomo-deployment-steps-card";
import { LomoActivationStatusCard } from "./components/lomo-activation-status-card";
import { type LoggedOutMonitoringErrorProps } from "./logged-out-monitoring";
import { LomoDeploymentGuidelinesCardLayout } from "./components/lomo-deployment-guidelines-card.layout";
import { EnableLomoCard } from "./components/enable-lomo-card";
import { LomoInsights } from "./lomo-insights";
import { LOMoHelperSideCard } from "./components/lomo-helper-side-card";
const I18N_KEYS = {
  TABS_INSIGHTS: "team_risk_detection_tabs_insights",
  TABS_SETTINGS: "team_risk_detection_tabs_settings",
  GUIDELINES_STEP_NUMBER: "team_risk_detection_setup_guidelines_step_number",
  GUIDELINES_TITLE_COLLAPSED:
    "team_risk_detection_setup_guidelines_title_collapsed",
};
interface Props {
  token: string;
  active: boolean;
  setError: (props: LoggedOutMonitoringErrorProps) => void;
}
export const LoggedOutMonitoringSetupPage = ({
  token,
  active,
  setError,
}: Props) => {
  const { translate } = useTranslate();
  const isBusinessPlus = useIsBusinessPlus();
  const [selectedTab, setSelectedTab] = useState<"settings" | "insights">(
    active ? "insights" : "settings"
  );
  const tabs = [
    {
      id: "tab-insights",
      title: translate(I18N_KEYS.TABS_INSIGHTS),
      contentId: "content-insights",
      onSelect: () => {
        setSelectedTab("insights");
      },
    },
    {
      id: "tab-settings",
      title: translate(I18N_KEYS.TABS_SETTINGS),
      contentId: "content-settings",
      onSelect: () => {
        setSelectedTab("settings");
      },
    },
  ];
  return (
    <>
      {active ? (
        <Tabs
          tabs={tabs}
          sx={{ margin: "0 42px" }}
          defaultTab={selectedTab === "settings" ? 1 : 0}
        />
      ) : null}

      <div aria-labelledby="tab-settings" id="content-settings">
        {selectedTab === "settings" ? (
          <ResponsiveMainSecondaryLayout
            fullWidth
            secondaryContentWidth="272px"
            reducedVerticalPadding
            mainContent={
              <div
                sx={{ display: "flex", flexDirection: "column", gap: "10px" }}
              >
                <LomoDeploymentStepsCard active={active} />
                {active ? (
                  <>
                    <LomoActivationStatusCard
                      token={token}
                      setError={setError}
                    />
                    <LomoDeploymentGuidelinesCardLayout
                      title={translate(I18N_KEYS.GUIDELINES_TITLE_COLLAPSED)}
                      setError={setError}
                      isCollapsible={true}
                    />
                  </>
                ) : (
                  <>
                    <LomoDeploymentGuidelinesCardLayout
                      title={translate(I18N_KEYS.GUIDELINES_STEP_NUMBER)}
                      setError={setError}
                    />
                    <EnableLomoCard setError={setError} />
                  </>
                )}
              </div>
            }
            secondaryContent={
              <GridContainer gap="16px">
                <LOMoHelperSideCard />
                {!isBusinessPlus ? (
                  <UpsellCard featureType={FeatureType.CRD} />
                ) : null}
              </GridContainer>
            }
          />
        ) : undefined}
      </div>

      <div aria-labelledby="tab-insights" id="content-insights">
        {selectedTab === "insights" ? (
          <Flex flexDirection="column" gap="16px" sx={{ padding: "16px 42px" }}>
            <LomoInsights setError={setError} />
          </Flex>
        ) : undefined}
      </div>
    </>
  );
};
