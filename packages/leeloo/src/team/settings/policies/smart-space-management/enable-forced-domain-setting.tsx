import { Policies, TeamPolicyUpdates } from "@dashlane/team-admin-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { SettingFieldProps, SettingRowModel } from "../types";
import { PolicySettingRow } from "../components/policy-setting-row";
const I18N_KEYS_LABELS = {
  TEAM_SETTINGS_ENABLE_SPACE_RESTRICTIONS:
    "team_settings_enable_space_restrictions",
  TEAM_SETTINGS_ENABLE_SPACE_RESTRICTIONS_HELPER:
    "team_settings_enable_space_restrictions_helper",
};
const I18N_KEYS_ERRORS = {
  TEAM_SETTINGS_GENERIC_ERROR:
    "team_settings_enable_space_restrictions_save_error_msg_generic_error",
  TEAM_SETTINGS_TOO_MANY_REQUESTS: "team_settings_too_many_requests",
  TEAM_SETTINGS_DEFINE_DOMAIN_FIRST:
    "team_settings_enable_space_restrictions_define_team_domain_first",
};
interface EnableForcedDomainSettingProps extends SettingFieldProps {
  isDiscontinuedAfterTrialAndSmartManagementIsDisabled: boolean;
}
export const EnableForcedDomainSetting = (
  props: EnableForcedDomainSettingProps
) => {
  const { translate } = useTranslate();
  const { isDiscontinuedAfterTrialAndSmartManagementIsDisabled, policies } =
    props;
  if (!policies) {
    return null;
  }
  const enableForcedDomainSettingField: SettingRowModel = {
    type: "switch",
    isReadOnly: isDiscontinuedAfterTrialAndSmartManagementIsDisabled,
    label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_ENABLE_SPACE_RESTRICTIONS),
    helperLabel: translate(
      I18N_KEYS_LABELS.TEAM_SETTINGS_ENABLE_SPACE_RESTRICTIONS_HELPER
    ),
    value: policies.enableForcedDomains,
    feature: "enableForcedDomains",
    getErrorMessageForKey: (key: string) => {
      switch (key) {
        case "too_many_requests":
          return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_TOO_MANY_REQUESTS);
        default:
          return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_GENERIC_ERROR);
      }
    },
    constraintsFromOtherFields: {
      disabledWhen: [
        {
          feature: "teamDomain",
          condition: (teamPolicies: Policies) =>
            !teamPolicies.teamDomain?.length,
          warningMessage: translate(
            I18N_KEYS_ERRORS.TEAM_SETTINGS_DEFINE_DOMAIN_FIRST
          ),
        },
      ],
      requiredFor: [
        {
          feature: "enableRemoveForcedContent",
          reset: (policyUpdates: TeamPolicyUpdates) =>
            (policyUpdates.enableRemoveForcedContent = false),
        },
      ],
    },
  };
  return (
    <PolicySettingRow settingRow={enableForcedDomainSettingField} {...props} />
  );
};
