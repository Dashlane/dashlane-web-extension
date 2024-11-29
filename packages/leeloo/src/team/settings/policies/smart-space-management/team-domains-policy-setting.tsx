import { TeamPolicyUpdates } from "@dashlane/team-admin-contracts";
import validator from "validator";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { PolicySettingRow } from "../components/policy-setting-row";
import { SettingFieldProps, SettingTextField } from "../types";
const FQDN_MAX_LENGTH = 255;
const I18N_KEYS_LABELS = {
  TEAM_DOMAIN_SETTINGS: "team_settings_team_domain",
  TEAM_DOMAIN_SETTINGS_HELPER: "team_settings_team_domain_helper",
  TEAM_DOMAIN_SETTINGS_PLACEHOLDER: "team_settings_team_domain_placeholder",
};
const I18N_KEYS_ERRORS = {
  TEAM_SETTINGS_TOO_MANY_REQUESTS: "team_settings_too_many_requests",
  TEAM_SETTINGS_SAVE_GENERIC_ERROR:
    "team_settings_team_domain_save_error_msg_generic_error",
  TEAM_SETTINGS_WRONG_SIZE:
    "team_settings_team_domain_save_error_msg_wrong_size",
  TEAM_SETTINGS_WRONG_URL: "team_settings_team_domain_save_error_msg_wrong_url",
};
interface TeamDomainsPolicySettingProps extends SettingFieldProps {
  isDiscontinuedAfterTrialAndSmartManagementIsDisabled: boolean;
}
export const TeamDomainsPolicySetting = (
  props: TeamDomainsPolicySettingProps
) => {
  const { translate } = useTranslate();
  const { isDiscontinuedAfterTrialAndSmartManagementIsDisabled, policies } =
    props;
  if (!policies) {
    return null;
  }
  const teamDomainSettingField: SettingTextField = {
    type: "text",
    multiLine: true,
    isReadOnly: isDiscontinuedAfterTrialAndSmartManagementIsDisabled,
    label: translate(I18N_KEYS_LABELS.TEAM_DOMAIN_SETTINGS),
    helperLabel: translate(I18N_KEYS_LABELS.TEAM_DOMAIN_SETTINGS_HELPER),
    hintText: translate(I18N_KEYS_LABELS.TEAM_DOMAIN_SETTINGS_PLACEHOLDER),
    feature: "teamDomain",
    value: policies.teamDomain,
    serializer: (domains: string) =>
      domains
        ? domains
            .split(";")
            .map((domain) => domain.trim().toLowerCase())
            .filter((domain) => Boolean(domain.length))
        : [],
    deserializer: (domains: string[]) =>
      domains?.length ? domains.join(";") : "",
    validator: (values: string[]) => {
      if (values.some((domain) => !validator.isFQDN(domain))) {
        return "wrong_url";
      }
      if (values.some((domain) => domain.length > FQDN_MAX_LENGTH)) {
        return "wrong_size";
      }
      return null;
    },
    getErrorMessageForKey: (key: string) => {
      switch (key) {
        case "wrong_size":
          return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_WRONG_SIZE, {
            lengthLimit: FQDN_MAX_LENGTH,
          });
        case "wrong_url":
          return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_WRONG_URL);
        case "too_many_requests":
          return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_TOO_MANY_REQUESTS);
        default:
          return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_SAVE_GENERIC_ERROR);
      }
    },
    constraintsFromOtherFields: {
      requiredFor: [
        {
          feature: "enableForcedDomains",
          reset: (policyUpdates: TeamPolicyUpdates) => {
            if (!policies.teamDomain.length) {
              policyUpdates.enableForcedDomains = false;
            }
          },
        },
        {
          feature: "enableRemoveForcedContent",
          reset: (policyUpdates: TeamPolicyUpdates) => {
            if (!policies.teamDomain.length) {
              policyUpdates.enableRemoveForcedContent = false;
            }
          },
        },
      ],
    },
  };
  return <PolicySettingRow settingRow={teamDomainSettingField} {...props} />;
};
