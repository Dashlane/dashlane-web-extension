import { openUrl } from "../../../../libs/external-urls";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { DASHLANE_SPACE_MANAGEMENT_ARTICLE } from "../../../urls";
import { PolicySettingRow } from "../components/policy-setting-row";
import { SettingRowModel } from "../types";
const I18N_KEYS_LABELS = {
  TEAM_SETTINGS_SPACE_MANAGEMENT_DISABLED_INFOBOX_TITLE:
    "team_settings_space_management_disabled_infobox_title",
  TEAM_SETTINGS_SPACE_MANAGEMENT_DISABLED_INFOBOX_SUBTITLE:
    "team_settings_space_management_disabled_infobox_subtitle",
  TEAM_SETTINGS_SPACE_MANAGEMENT_INFOBOX_LEARN_MORE:
    "team_settings_space_management_infobox_learn_more_button",
  TEAM_SETTINGS_SPACE_MANAGEMENT_INFOBOX_DISABLE_BUTTON:
    "team_settings_space_management_infobox_disable_button",
};
export const SmartSpaceManagementDisabledInfobox = () => {
  const { translate } = useTranslate();
  const disableInfoboxSettingField: SettingRowModel = {
    type: "quickDisable",
    label: translate(
      I18N_KEYS_LABELS.TEAM_SETTINGS_SPACE_MANAGEMENT_DISABLED_INFOBOX_TITLE
    ),
    description: translate(
      I18N_KEYS_LABELS.TEAM_SETTINGS_SPACE_MANAGEMENT_DISABLED_INFOBOX_SUBTITLE
    ),
    icon: "FeedbackSuccessOutlined",
    mood: "positive",
    actions: {
      secondary: {
        label: translate(
          I18N_KEYS_LABELS.TEAM_SETTINGS_SPACE_MANAGEMENT_INFOBOX_LEARN_MORE
        ),
        onClick: () => openUrl(DASHLANE_SPACE_MANAGEMENT_ARTICLE),
      },
    },
  };
  return <PolicySettingRow settingRow={disableInfoboxSettingField} />;
};
