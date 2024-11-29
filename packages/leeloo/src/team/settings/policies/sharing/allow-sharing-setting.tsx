import useTranslate from "../../../../libs/i18n/useTranslate";
import { useIsStandard } from "../../../helpers/use-is-standard";
import { PolicySettingRow } from "../components/policy-setting-row";
import { SettingFieldProps, SettingRowModel } from "../types";
const I18N_KEYS_LABELS = {
  AVAILABLE_IN_BUSINESS_PLAN: "team_settings_available_in_business_plan",
  ALLOW_SHARING_LABEL: "team_settings_allow_sharing",
  ALLOW_SHARING_HELPER_LABEL: "team_settings_allow_sharing_helper",
};
const I18N_KEYS_ERRORS = {
  TEAM_SETTINGS_TOO_MANY_REQUESTS: "team_settings_too_many_requests",
  ALLOW_SHARING_SAVE_ERROR_GENERIC_ERROR:
    "team_settings_allow_sharing_save_error_msg_generic_error",
};
interface AllowSharingSettingProps extends SettingFieldProps {
  hasExcludedPolicy: (policy: string) => boolean;
  hasTrialBusinessPaywall: boolean;
  isTeamDiscontinuedAfterTrial: boolean;
}
export const AllowSharingSetting = (props: AllowSharingSettingProps) => {
  const { translate } = useTranslate();
  const isStandardPlan = useIsStandard();
  const {
    hasTrialBusinessPaywall,
    hasExcludedPolicy,
    isTeamDiscontinuedAfterTrial,
    policies,
  } = props;
  const hasExcludedSharingSettingPolicy = hasExcludedPolicy("sharingDisabled");
  if (!policies) {
    return null;
  }
  const allowSharingSettingRow: SettingRowModel = {
    type: "switch",
    isReadOnly:
      isTeamDiscontinuedAfterTrial ||
      hasExcludedSharingSettingPolicy ||
      isStandardPlan,
    label: translate(I18N_KEYS_LABELS.ALLOW_SHARING_LABEL),
    helperLabel: translate(I18N_KEYS_LABELS.ALLOW_SHARING_HELPER_LABEL),
    value: policies.allowSharing,
    feature: "allowSharing",
    badgeIconName:
      hasExcludedSharingSettingPolicy ||
      hasTrialBusinessPaywall ||
      isStandardPlan
        ? "PremiumOutlined"
        : undefined,
    badgeLabel:
      hasExcludedSharingSettingPolicy ||
      hasTrialBusinessPaywall ||
      isStandardPlan
        ? translate(I18N_KEYS_LABELS.AVAILABLE_IN_BUSINESS_PLAN)
        : undefined,
    getErrorMessageForKey: (key: string) => {
      switch (key) {
        case "too_many_requests":
          return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_TOO_MANY_REQUESTS);
        default:
          return translate(
            I18N_KEYS_ERRORS.ALLOW_SHARING_SAVE_ERROR_GENERIC_ERROR
          );
      }
    },
    constraintsFromOtherFields: {
      requiredFor: [
        {
          feature: "restrictSharingToTeam",
          reset: (policyUpdates) =>
            (policyUpdates.restrictSharingToTeam = false),
        },
      ],
    },
  };
  return <PolicySettingRow settingRow={allowSharingSettingRow} {...props} />;
};
