import useTranslate from "../../../../libs/i18n/useTranslate";
import { useIsStandard } from "../../../helpers/use-is-standard";
import { PolicySettingRow } from "../components/policy-setting-row";
import { SettingFieldProps, SettingRowModel } from "../types";
const I18N_KEYS_LABELS = {
  AVAILABLE_IN_BUSINESS_PLAN: "team_settings_available_in_business_plan",
  TEAM_SETTINGS_FORCE_AUTO_LOGOUT: "team_settings_force_auto_logout_after",
  TEAM_SETTINGS_FORCE_AUTO_LOGOUT_HELPER:
    "team_settings_force_auto_logout_after_helper",
};
const I18N_KEYS_ERRORS = {
  TEAM_SETTINGS_TOO_MANY_REQUESTS: "team_settings_too_many_requests",
  TEAM_SETTINGS_FORCE_AUTO_LOGOUT_GENERIC_ERROR:
    "team_settings_force_auto_logout_after_save_error_msg_generic_error",
};
interface ForceAutoLogoutSettingProps extends SettingFieldProps {
  hasExcludedPolicy: (policy: string) => boolean;
  hasTrialBusinessPaywall: boolean;
  isPersonalSpaceEnabledViaTeamSetting: boolean;
  isTeamDiscontinuedAfterTrial: boolean;
}
export const ForceAutoLogoutSetting = (props: ForceAutoLogoutSettingProps) => {
  const { translate } = useTranslate();
  const isStandardPlan = useIsStandard();
  const {
    hasExcludedPolicy,
    hasTrialBusinessPaywall,
    isTeamDiscontinuedAfterTrial,
    policies,
  } = props;
  const hasExcludedForceAutomaticLogoutPolicy = hasExcludedPolicy(
    "forceAutomaticLogout"
  );
  if (!policies) {
    return null;
  }
  const forceAutoLogoutSettingRow: SettingRowModel = {
    type: "select",
    isReadOnly:
      isTeamDiscontinuedAfterTrial ||
      hasExcludedForceAutomaticLogoutPolicy ||
      isStandardPlan,
    label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_FORCE_AUTO_LOGOUT),
    helperLabel: translate(
      I18N_KEYS_LABELS.TEAM_SETTINGS_FORCE_AUTO_LOGOUT_HELPER
    ),
    badgeIconName:
      hasExcludedForceAutomaticLogoutPolicy ||
      hasTrialBusinessPaywall ||
      isStandardPlan
        ? "PremiumOutlined"
        : undefined,
    badgeLabel:
      hasExcludedForceAutomaticLogoutPolicy ||
      hasTrialBusinessPaywall ||
      isStandardPlan
        ? translate(I18N_KEYS_LABELS.AVAILABLE_IN_BUSINESS_PLAN)
        : undefined,
    value: policies.forceAutomaticLogout,
    feature: "forceAutomaticLogout",
    options: ["unset", "15", "30", "60"].map((durationInMinutes) => ({
      label: translate(
        "team_settings_force_auto_logout_after_" + durationInMinutes
      ),
      value: durationInMinutes,
    })),
    getErrorMessageForKey: (key: string) => {
      switch (key) {
        case "too_many_requests":
          return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_TOO_MANY_REQUESTS);
        default:
          return translate(
            I18N_KEYS_ERRORS.TEAM_SETTINGS_FORCE_AUTO_LOGOUT_GENERIC_ERROR
          );
      }
    },
  };
  return <PolicySettingRow settingRow={forceAutoLogoutSettingRow} {...props} />;
};
