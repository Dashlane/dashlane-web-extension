import { Policies } from "@dashlane/team-admin-contracts";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { SettingFieldProps, SettingRowModel } from "../types";
import { PolicySettingRow } from "../components/policy-setting-row";
const I18N_KEYS_LABELS = {
  TEAM_SETTINGS_REMOVED_FORCED_CONTENT: "team_settings_remove_forced_content",
  TEAM_SETTINGS_REMOVED_FORCED_CONTENT_HELPER:
    "team_settings_remove_forced_content_helper",
};
const I18N_KEYS_ERRORS = {
  TEAM_SETTINGS_GENERIC_ERROR:
    "team_settings_enable_space_restrictions_save_error_msg_generic_error",
  TEAM_SETTINGS_TOO_MANY_REQUESTS: "team_settings_too_many_requests",
  TEAM_SETTINGS_REMOVED_FORCED_CONTENT_DEFINE_TEAM_DOMAIN:
    "team_settings_remove_forced_content_define_team_domain_first",
  TEAM_SETTINGS_REMOVED_FORCED_CONTENT_ENABLE_FORCED_DOMAINS:
    "team_settings_remove_forced_content_enable_forced_domains_first",
};
interface EnableRemoveForcedContentSettingProps extends SettingFieldProps {
  isDiscontinuedAfterTrialAndSmartManagementIsDisabled: boolean;
}
export const EnableRemoveForcedContentSetting = (
  props: EnableRemoveForcedContentSettingProps
) => {
  const { translate } = useTranslate();
  const { isDiscontinuedAfterTrialAndSmartManagementIsDisabled, policies } =
    props;
  if (!policies) {
    return null;
  }
  const enableRemoveForcedContentSettingField: SettingRowModel = {
    type: "switch",
    label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_REMOVED_FORCED_CONTENT),
    isReadOnly: isDiscontinuedAfterTrialAndSmartManagementIsDisabled,
    helperLabel: translate(
      I18N_KEYS_LABELS.TEAM_SETTINGS_REMOVED_FORCED_CONTENT_HELPER
    ),
    value: policies.enableRemoveForcedContent,
    feature: "enableRemoveForcedContent",
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
            I18N_KEYS_ERRORS.TEAM_SETTINGS_REMOVED_FORCED_CONTENT_DEFINE_TEAM_DOMAIN
          ),
        },
        {
          feature: "enableForcedDomains",
          condition: (teamPolicies: Policies) =>
            !teamPolicies.enableForcedDomains,
          warningMessage: translate(
            I18N_KEYS_ERRORS.TEAM_SETTINGS_REMOVED_FORCED_CONTENT_ENABLE_FORCED_DOMAINS
          ),
        },
      ],
    },
  };
  return (
    <PolicySettingRow
      settingRow={enableRemoveForcedContentSettingField}
      {...props}
    />
  );
};
