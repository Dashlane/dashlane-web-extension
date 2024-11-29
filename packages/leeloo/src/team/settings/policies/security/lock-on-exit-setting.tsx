import useTranslate from "../../../../libs/i18n/useTranslate";
import { PolicySettingRow } from "../components/policy-setting-row";
import { SettingFieldProps, SettingRowModel } from "../types";
const I18N_KEYS_LABELS = {
  AVAILABLE_IN_BUSINESS_PLAN: "team_settings_available_in_business_plan",
  TEAM_SETTINGS_LOCK_ON_EXIT: "team_settings_lock_on_exit",
  TEAM_SETTINGS_LOCK_ON_EXIT_HELPER: "team_settings_lock_on_exit_helper",
};
const I18N_KEYS_ERRORS = {
  TEAM_SETTINGS_TOO_MANY_REQUESTS: "team_settings_too_many_requests",
  TEAM_SETTINGS_LOCK_ON_EXIT_GENERIC_ERROR:
    "team_settings_lock_on_exit_save_error_msg_generic_error",
};
interface LockOnExitSettingProps extends SettingFieldProps {
  hasExcludedPolicy: (policy: string) => boolean;
  hasTrialBusinessPaywall: boolean;
  isTeamDiscontinuedAfterTrial: boolean;
}
export const LockOnExitSetting = (props: LockOnExitSettingProps) => {
  const { translate } = useTranslate();
  const {
    hasExcludedPolicy,
    hasTrialBusinessPaywall,
    isTeamDiscontinuedAfterTrial,
    policies,
  } = props;
  const hasExcludedLockOnExitPolicy = hasExcludedPolicy("lockOnExit");
  if (!policies) {
    return null;
  }
  const lockOnExitSettingRow: SettingRowModel = {
    type: "switch",
    isReadOnly: isTeamDiscontinuedAfterTrial || hasExcludedLockOnExitPolicy,
    label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_LOCK_ON_EXIT),
    helperLabel: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_LOCK_ON_EXIT_HELPER),
    value: policies.lockOnExit,
    feature: "lockOnExit",
    badgeIconName:
      hasExcludedLockOnExitPolicy || hasTrialBusinessPaywall
        ? "PremiumOutlined"
        : undefined,
    badgeLabel:
      hasExcludedLockOnExitPolicy || hasTrialBusinessPaywall
        ? translate(I18N_KEYS_LABELS.AVAILABLE_IN_BUSINESS_PLAN)
        : undefined,
    getErrorMessageForKey: (key: string) => {
      switch (key) {
        case "too_many_requests":
          return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_TOO_MANY_REQUESTS);
        default:
          return translate(
            I18N_KEYS_ERRORS.TEAM_SETTINGS_LOCK_ON_EXIT_GENERIC_ERROR
          );
      }
    },
  };
  return <PolicySettingRow settingRow={lockOnExitSettingRow} {...props} />;
};
