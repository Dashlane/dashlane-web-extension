import useTranslate from "../../../../libs/i18n/useTranslate";
import { PolicySettingRow } from "../components/policy-setting-row";
import { SettingFieldProps, SettingRowModel } from "../types";
const I18N_KEYS_LABELS = {
  TEAM_SETTINGS_ENFORCE_2FA: "team_settings_enforce_2fa",
  TEAM_SETTINGS_ENFORCE_2FA_HELPER: "team_settings_enforce_2fa_helper",
  TEAM_SETTINGS_ENFORCE_2FA_CONFIRM:
    "team_settings_enforce_2fa_confirm_enable_title",
  TEAM_SETTINGS_ENFORCE_2FA_CONFIRM_HELPER:
    "team_settings_enforce_2fa_confirm_enable_helper2",
  TEAM_SETTINGS_ENFORCE_2FA_CONFIRM_DISMISS:
    "team_settings_enforce_2fa_confirm_enable_dismiss",
  TEAM_SETTINGS_ENFORCE_2FA_CONFIRM_CHOICE:
    "team_settings_enforce_2fa_confirm_enable_confirm",
  TEAM_SETTINGS_GENERATE_RECOVERY_CODES:
    "team_settings_generate_recovery_codes_infobox_title",
  TEAM_SETTINGS_GENERATE_RECOVERY_CODES_MARKUP:
    "team_settings_generate_recovery_codes_infobox_description_markup",
};
const I18N_KEYS_ERRORS = {
  TEAM_SETTINGS_TOO_MANY_REQUESTS: "team_settings_too_many_requests",
  TEAM_SETTINGS_VPN_ENFORCE_2FA_GENERIC_ERROR:
    "team_settings_enforce_2fa_save_error_msg_generic_error",
};
interface FEnforce2FASettingProps extends SettingFieldProps {
  isTeamDiscontinuedAfterTrial: boolean;
}
export const Enforce2FASetting = (props: FEnforce2FASettingProps) => {
  const { translate } = useTranslate();
  const { isTeamDiscontinuedAfterTrial, policies } = props;
  if (!policies) {
    return null;
  }
  const enforce2FASettingRow: SettingRowModel = {
    type: "switch",
    isReadOnly: isTeamDiscontinuedAfterTrial,
    label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_ENFORCE_2FA),
    helperLabel: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_ENFORCE_2FA_HELPER),
    infoBox: {
      title: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_GENERATE_RECOVERY_CODES),
      description: translate.markup(
        I18N_KEYS_LABELS.TEAM_SETTINGS_GENERATE_RECOVERY_CODES_MARKUP
      ),
    },
    value: policies.enforce2FA,
    feature: "enforce2FA",
    confirmEnable: {
      title: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_ENFORCE_2FA_CONFIRM),
      label: translate(
        I18N_KEYS_LABELS.TEAM_SETTINGS_ENFORCE_2FA_CONFIRM_HELPER
      ),
      dismiss: translate(
        I18N_KEYS_LABELS.TEAM_SETTINGS_ENFORCE_2FA_CONFIRM_DISMISS
      ),
      confirm: translate(
        I18N_KEYS_LABELS.TEAM_SETTINGS_ENFORCE_2FA_CONFIRM_CHOICE
      ),
    },
    getErrorMessageForKey: (key: string) => {
      switch (key) {
        case "too_many_requests":
          return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_TOO_MANY_REQUESTS);
        default:
          return translate(
            I18N_KEYS_ERRORS.TEAM_SETTINGS_VPN_ENFORCE_2FA_GENERIC_ERROR
          );
      }
    },
  };
  return <PolicySettingRow settingRow={enforce2FASettingRow} {...props} />;
};
