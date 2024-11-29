import { openUrl } from "../../../../libs/external-urls";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { SettingQuickDisable } from "../types";
import { DASHLANE_SPACE_MANAGEMENT_ARTICLE } from "../../../urls";
import { PolicySettingRow } from "../components/policy-setting-row";
const I18N_KEYS_LABELS = {
  TEAM_SETTINGS_SPACE_MANAGEMENT_CLICK_TO_DISABLE_INFOBOX_TITLE:
    "team_settings_space_management_click_to_disable_infobox_title",
  TEAM_SETTINGS_SPACE_MANAGEMENT_CLICK_TO_DISABLE_INFOBOX_SUBTITLE:
    "team_settings_space_management_click_to_disable_infobox_subtitle",
  TEAM_SETTINGS_SPACE_MANAGEMENT_INFOBOX_LEARN_MORE:
    "team_settings_space_management_infobox_learn_more_button",
  TEAM_SETTINGS_SPACE_MANAGEMENT_INFOBOX_DISABLE_BUTTON:
    "team_settings_space_management_infobox_disable_button",
};
export const DisableSmartSpaceManagementInfobox = () => {
  const { translate } = useTranslate();
  const clickToDisableSettingField: SettingQuickDisable = {
    type: "quickDisable",
    label: translate(
      I18N_KEYS_LABELS.TEAM_SETTINGS_SPACE_MANAGEMENT_CLICK_TO_DISABLE_INFOBOX_TITLE
    ),
    description: translate(
      I18N_KEYS_LABELS.TEAM_SETTINGS_SPACE_MANAGEMENT_CLICK_TO_DISABLE_INFOBOX_SUBTITLE
    ),
    mood: "brand",
    featuresToDisable: {
      enableForcedDomains: false,
      enableRemoveForcedContent: false,
    },
    actions: {
      primary: {
        label: translate(
          I18N_KEYS_LABELS.TEAM_SETTINGS_SPACE_MANAGEMENT_INFOBOX_DISABLE_BUTTON
        ),
      },
      secondary: {
        label: translate(
          I18N_KEYS_LABELS.TEAM_SETTINGS_SPACE_MANAGEMENT_INFOBOX_LEARN_MORE
        ),
        onClick: () => openUrl(DASHLANE_SPACE_MANAGEMENT_ARTICLE),
      },
    },
  };
  return <PolicySettingRow settingRow={clickToDisableSettingField} />;
};
