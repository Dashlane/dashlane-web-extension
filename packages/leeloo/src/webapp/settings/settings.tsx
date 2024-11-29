import { DataStatus } from "@dashlane/carbon-api-consumers";
import { useFeatureFlips } from "@dashlane/framework-react";
import { FEATURE_FLIPS_WITHOUT_MODULE } from "@dashlane/framework-dashlane-application";
import { Flex, TabConfiguration, Tabs } from "@dashlane/design-system";
import {
  SettingsConfiguration,
  SettingsRouteParams,
  SettingTab,
} from "./types";
import {
  redirect,
  useParams,
  useRouterGlobalSettingsContext,
} from "../../libs/router";
import useTranslate from "../../libs/i18n/useTranslate";
import { Lee } from "../../lee";
import { SettingsHeader } from "./settings-header";
import { PrivacySettings } from "./privacy-settings/privacy-settings";
import { AppearanceSettings } from "./appearance-settings/appearance-settings";
interface SettingsProps {
  lee: Lee;
}
export const I18N_TABS_KEYS: Record<SettingTab, string> = {
  [SettingTab.Privacy]: "webapp_privacy_settings_tab",
  [SettingTab.Appearance]: "webapp_appearance_settings_tab",
};
export const Settings = ({ lee }: SettingsProps) => {
  const featureFlips = useFeatureFlips();
  const { settingTab } = useParams<SettingsRouteParams>();
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  if (featureFlips.status !== DataStatus.Success) {
    return null;
  }
  const isSettingsRevampEnabled =
    featureFlips.data[FEATURE_FLIPS_WITHOUT_MODULE.SettingsRevamp];
  const settings: SettingsConfiguration = {
    [SettingTab.Privacy]: {
      title: translate(I18N_TABS_KEYS[SettingTab.Privacy]),
      component: () => <PrivacySettings lee={lee} />,
    },
    [SettingTab.Appearance]: {
      title: translate(I18N_TABS_KEYS[SettingTab.Appearance]),
      component: () => <AppearanceSettings />,
      hidden: !isSettingsRevampEnabled,
    },
  };
  if (settings[settingTab].hidden) {
    redirect(routes.userSettings);
  }
  const tabs: TabConfiguration[] = Object.entries(settings)
    .filter(([, { hidden }]) => !hidden)
    .map(([slug, { title }]) => ({
      title,
      id: `tab-${slug}`,
      contentId: `content-${slug}`,
      onSelect: () => {
        if (slug !== settingTab) {
          redirect(routes.userSettingsTab(slug as SettingTab));
        }
      },
    }));
  const CurrentSettingsComponent = settings[settingTab].component;
  return (
    <div
      sx={{
        background: "ds.background.alternate",
        width: "100%",
        minHeight: "100%",
      }}
    >
      <SettingsHeader />
      <Flex
        flexDirection="column"
        sx={{
          padding: "0 24px 64px",
          gap: "32px",
        }}
      >
        <Tabs
          tabs={tabs}
          defaultTab={Object.keys(settings).indexOf(settingTab)}
        />
        <div aria-labelledby={`tab-${settingTab}`} id={`content-${settingTab}`}>
          <CurrentSettingsComponent />
        </div>
      </Flex>
    </div>
  );
};
