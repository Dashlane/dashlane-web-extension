import { Tabs } from "@dashlane/design-system";
import { useState } from "react";
import useTranslate from "../../../libs/i18n/useTranslate";
import { NudgesConfigurations } from "./nudges-configurations";
import { NudgesInsights } from "./nudges-insights";
import { logPageView } from "../../../libs/logs/logEvent";
import { PageView } from "@dashlane/hermes";
const I18N_KEYS = {
  TABS_INSIGHTS: "team_settings_nudges_tabs_insights",
  TABS_CONFIGURATION: "team_settings_nudges_tabs_configuration",
};
export const NudgesPostSetup = () => {
  const { translate } = useTranslate();
  const [selectedTab, setSelectedTab] = useState<"settings" | "insights">(
    "settings"
  );
  const tabs = [
    {
      id: "tab-insights",
      title: translate(I18N_KEYS.TABS_INSIGHTS),
      contentId: "content-insights",
      onSelect: () => {
        logPageView(PageView.ToolsNudgesInsights);
        setSelectedTab("insights");
      },
    },
    {
      id: "tab-settings",
      title: translate(I18N_KEYS.TABS_CONFIGURATION),
      contentId: "content-settings",
      onSelect: () => {
        logPageView(PageView.ToolsNudgesConfiguration);
        setSelectedTab("settings");
      },
    },
  ];
  return (
    <>
      <Tabs tabs={tabs} sx={{ margin: "0 32px 16px" }} defaultTab={1} />

      <div
        aria-labelledby="tab-settings"
        id="content-settings"
        sx={{
          display: selectedTab === "settings" ? "block" : "none",
        }}
      >
        <NudgesConfigurations />
      </div>

      <div
        aria-labelledby="tab-insights"
        id="content-insights"
        sx={{
          display: selectedTab === "insights" ? "block" : "none",
        }}
      >
        <NudgesInsights />
      </div>
    </>
  );
};
