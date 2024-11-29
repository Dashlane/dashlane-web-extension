import useTranslate from "../../../../libs/i18n/useTranslate";
import { useIsStandard } from "../../../helpers/use-is-standard";
import { PolicySettingRow } from "../components/policy-setting-row";
import { SettingFieldProps, SettingRowModel } from "../types";
const I18N_KEYS_LABELS = {
  AVAILABLE_IN_BUSINESS_PLAN: "team_settings_available_in_business_plan",
  TEAM_SETTINGS_AUDIT_LOGS:
    "team_settings_collect_sensitive_data_audit_logs_enabled",
  TEAM_SETTINGS_AUDIT_LOGS_HELPER:
    "team_settings_collect_sensitive_data_audit_logs_enabled_helper",
  TEAM_SETTINGS_AUDIT_LOGS_HELPER_WITHOUT_SPACES:
    "team_settings_collect_sensitive_data_audit_logs_enabled_helper_without_space",
};
const I18N_KEYS_ERRORS = {
  TEAM_SETTINGS_TOO_MANY_REQUESTS: "team_settings_too_many_requests",
  TEAM_SETTINGS_LOCK_ON_EXIT_GENERIC_ERROR:
    "team_settings_lock_on_exit_save_error_msg_generic_error",
};
interface AuditLogSettingProps extends SettingFieldProps {
  hasExcludedPolicy: (policy: string) => boolean;
  hasTrialBusinessPaywall: boolean;
  isPersonalSpaceEnabledViaTeamSetting: boolean;
  isTeamDiscontinuedAfterTrial: boolean;
}
export const AuditLogSetting = (props: AuditLogSettingProps) => {
  const { translate } = useTranslate();
  const isStandardPlan = useIsStandard();
  const {
    hasExcludedPolicy,
    hasTrialBusinessPaywall,
    isPersonalSpaceEnabledViaTeamSetting,
    isTeamDiscontinuedAfterTrial,
    policies,
  } = props;
  const hasExcludedCollectSensitiveDataAuditLogsEnabledPolicy =
    hasExcludedPolicy("collectSensitiveDataAuditLogsEnabled");
  if (!policies) {
    return null;
  }
  const auditLogSettingRow: SettingRowModel = {
    type: "switch",
    isReadOnly:
      isTeamDiscontinuedAfterTrial ||
      hasExcludedCollectSensitiveDataAuditLogsEnabledPolicy ||
      isStandardPlan,
    label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_AUDIT_LOGS),
    helperLabel: translate(
      isPersonalSpaceEnabledViaTeamSetting
        ? I18N_KEYS_LABELS.TEAM_SETTINGS_AUDIT_LOGS_HELPER
        : I18N_KEYS_LABELS.TEAM_SETTINGS_AUDIT_LOGS_HELPER_WITHOUT_SPACES
    ),
    badgeIconName:
      hasExcludedCollectSensitiveDataAuditLogsEnabledPolicy ||
      hasTrialBusinessPaywall ||
      isStandardPlan
        ? "PremiumOutlined"
        : undefined,
    badgeLabel:
      hasExcludedCollectSensitiveDataAuditLogsEnabledPolicy ||
      hasTrialBusinessPaywall ||
      isStandardPlan
        ? translate(I18N_KEYS_LABELS.AVAILABLE_IN_BUSINESS_PLAN)
        : undefined,
    value: policies.collectSensitiveDataAuditLogsEnabled,
    feature: "collectSensitiveDataAuditLogsEnabled",
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
  return <PolicySettingRow settingRow={auditLogSettingRow} {...props} />;
};
