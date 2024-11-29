import useTranslate from "../../../../libs/i18n/useTranslate";
import { PolicySettingRow } from "../components/policy-setting-row";
import { SettingFieldProps, SettingRowModel } from "../types";
const I18N_KEYS_LABELS = {
  TEAM_SETTINGS_ALLOW_EXPORT: "team_settings_allow_export",
  TEAM_SETTINGS_ALLOW_EXPORT_HELPER: "team_settings_allow_export_helper",
  TEAM_SETTINGS_ALLOW_EXPORT_INFOBOX_TITLE:
    "team_settings_allow_export_infobox_title",
  TEAM_SETTINGS_ALLOW_EXPORT_INFOBOX_SUBTITLE:
    "team_settings_allow_export_infobox_subtitle",
};
const I18N_KEYS_ERRORS = {
  TEAM_SETTINGS_TOO_MANY_REQUESTS: "team_settings_too_many_requests",
  TEAM_SETTINGS_COMMON_GENERIC_ERROR: "_common_generic_error",
};
interface AllowExportSettingProps extends SettingFieldProps {
  isPersonalSpaceEnabledViaTeamSetting: boolean;
  isTeamDiscontinuedAfterTrial: boolean;
}
export const AllowExportSetting = (props: AllowExportSettingProps) => {
  const { translate } = useTranslate();
  const {
    isPersonalSpaceEnabledViaTeamSetting,
    isTeamDiscontinuedAfterTrial,
    policies,
  } = props;
  if (!policies || isPersonalSpaceEnabledViaTeamSetting) {
    return null;
  }
  const allowExportSettingRow: SettingRowModel = {
    type: "switch",
    label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_ALLOW_EXPORT),
    helperLabel: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_ALLOW_EXPORT_HELPER),
    infoBox: isTeamDiscontinuedAfterTrial
      ? {
          title: translate(
            I18N_KEYS_LABELS.TEAM_SETTINGS_ALLOW_EXPORT_INFOBOX_TITLE
          ),
          description: translate(
            I18N_KEYS_LABELS.TEAM_SETTINGS_ALLOW_EXPORT_INFOBOX_SUBTITLE
          ),
          mood: "brand",
        }
      : undefined,
    value: policies.vaultExportEnabled,
    feature: "vaultExportEnabled",
    getErrorMessageForKey: (key: string) => {
      switch (key) {
        case "too_many_requests":
          return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_TOO_MANY_REQUESTS);
        default:
          return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_COMMON_GENERIC_ERROR);
      }
    },
  };
  return <PolicySettingRow settingRow={allowExportSettingRow} {...props} />;
};
