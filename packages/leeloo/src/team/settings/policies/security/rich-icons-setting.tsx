import useTranslate from "../../../../libs/i18n/useTranslate";
import { SettingFieldProps, SettingRowModel } from "../types";
import { PolicySettingRow } from "../components/policy-setting-row";
const I18N_KEYS = {
  RICH_ICONS_LABEL: "team_settings_rich_icons",
  RICH_ICONS_HELPER: "team_settings_rich_icons_helper",
  TEAM_SETTINGS_TOO_MANY_REQUESTS: "team_settings_too_many_requests",
  TEAM_SETTINGS_DISABLED_GENERIC_ERROR: "team_settings_server_error",
};
export const RichIconsSetting = (props: SettingFieldProps) => {
  const { translate } = useTranslate();
  const { policies } = props;
  if (!policies) {
    return null;
  }
  const richIconSettingRow: SettingRowModel = {
    type: "switch",
    label: translate(I18N_KEYS.RICH_ICONS_LABEL),
    helperLabel: translate(I18N_KEYS.RICH_ICONS_HELPER),
    value: policies.richIconsEnabled,
    feature: "richIconsEnabled",
    getErrorMessageForKey: (key: string) => {
      return key === "too_many_requests"
        ? translate(I18N_KEYS.TEAM_SETTINGS_TOO_MANY_REQUESTS)
        : translate(I18N_KEYS.TEAM_SETTINGS_DISABLED_GENERIC_ERROR);
    },
  };
  return <PolicySettingRow settingRow={richIconSettingRow} {...props} />;
};
