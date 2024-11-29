import { ParsedURL } from "@dashlane/url-parser";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useIsStandard } from "../../../helpers/use-is-standard";
import { PolicySettingRow } from "../components/policy-setting-row";
import { SettingFieldProps, SettingRowModel } from "../types";
const I18N_KEYS_LABELS = {
  AVAILABLE_IN_BUSINESS_PLAN: "team_settings_available_in_business_plan",
  TEAM_SETTINGS_DISABLE_AUTOLOGIN_DOMAINS:
    "team_settings_disable_auto_login_domains",
  TEAM_SETTINGS_DISABLE_AUTOLOGIN_DOMAINS_HELPER:
    "team_settings_disable_auto_login_domains_helper",
  TEAM_SETTINGS_DISABLE_AUTOLOGIN_DOMAINS_PLACEHOLDER:
    "team_settings_disable_auto_login_domains_placeholder",
};
const I18N_KEYS_ERRORS = {
  TEAM_SETTINGS_TOO_MANY_REQUESTS: "team_settings_too_many_requests",
  TEAM_SETTINGS_DISABLE_AUTOLOGIN_WRONG_SIZE:
    "team_settings_disable_auto_login_domains_save_error_msg_wrong_size",
  TEAM_SETTINGS_DISABLE_AUTOLOGIN_WRONG_URL:
    "team_settings_disable_auto_login_domains_save_error_msg_wrong_url",
  TEAM_SETTINGS_DISABLE_AUTOLOGIN_GENERIC_ERROR:
    "team_settings_disable_auto_login_domains_save_error_msg_generic_error",
};
const FQDN_MAX_LENGTH = 255;
interface TurnOffAutoLoginAndAutofillSettingProps extends SettingFieldProps {
  hasExcludedPolicy: (policy: string) => boolean;
  hasTrialBusinessPaywall: boolean;
  isTeamDiscontinuedAfterTrial: boolean;
}
export const TurnOffAutoLoginAndAutofillSetting = (
  props: TurnOffAutoLoginAndAutofillSettingProps
) => {
  const { translate } = useTranslate();
  const isStandardPlan = useIsStandard();
  const {
    hasTrialBusinessPaywall,
    hasExcludedPolicy,
    isTeamDiscontinuedAfterTrial,
    policies,
  } = props;
  const hasExcludedAutoLoginDomainsPolicy = hasExcludedPolicy(
    "autologinDomainDisabledArray"
  );
  if (!policies) {
    return null;
  }
  const turnOffAutoLoginAndAutofillSettingRow: SettingRowModel = {
    type: "text",
    isReadOnly:
      isTeamDiscontinuedAfterTrial ||
      hasExcludedAutoLoginDomainsPolicy ||
      isStandardPlan,
    multiLine: true,
    label: translate(I18N_KEYS_LABELS.TEAM_SETTINGS_DISABLE_AUTOLOGIN_DOMAINS),
    helperLabel: translate(
      I18N_KEYS_LABELS.TEAM_SETTINGS_DISABLE_AUTOLOGIN_DOMAINS_HELPER
    ),
    hintText: translate(
      I18N_KEYS_LABELS.TEAM_SETTINGS_DISABLE_AUTOLOGIN_DOMAINS_PLACEHOLDER
    ),
    value: policies.disableAutoLoginDomains,
    badgeIconName:
      hasExcludedAutoLoginDomainsPolicy ||
      hasTrialBusinessPaywall ||
      isStandardPlan
        ? "PremiumOutlined"
        : undefined,
    badgeLabel:
      hasExcludedAutoLoginDomainsPolicy ||
      hasTrialBusinessPaywall ||
      isStandardPlan
        ? translate(I18N_KEYS_LABELS.AVAILABLE_IN_BUSINESS_PLAN)
        : undefined,
    serializer: (domainList) => {
      const domains = domainList.length ? domainList.split(";") : [];
      return domains
        .filter((domain: string) => !!domain.length)
        .map((domain: string) => domain.trim());
    },
    deserializer: (domains) => (domains?.length ? domains.join(";") : ""),
    validator: (values: string[]) => {
      if (
        values.some((domain) => {
          const parsedDomain = new ParsedURL(domain);
          return !parsedDomain.isUrlValid();
        })
      ) {
        return "wrong_url";
      }
      if (values.some((domain) => domain.length > FQDN_MAX_LENGTH)) {
        return "wrong_size";
      }
      return null;
    },
    feature: "disableAutoLoginDomains",
    getErrorMessageForKey: (key) => {
      switch (key) {
        case "wrong_size":
          return translate(
            I18N_KEYS_ERRORS.TEAM_SETTINGS_DISABLE_AUTOLOGIN_WRONG_SIZE,
            {
              lengthLimit: FQDN_MAX_LENGTH,
            }
          );
        case "wrong_url":
          return translate(
            I18N_KEYS_ERRORS.TEAM_SETTINGS_DISABLE_AUTOLOGIN_WRONG_URL
          );
        case "too_many_requests":
          return translate(I18N_KEYS_ERRORS.TEAM_SETTINGS_TOO_MANY_REQUESTS);
        default:
          return translate(
            I18N_KEYS_ERRORS.TEAM_SETTINGS_DISABLE_AUTOLOGIN_GENERIC_ERROR
          );
      }
    },
  };
  return (
    <PolicySettingRow
      settingRow={turnOffAutoLoginAndAutofillSettingRow}
      {...props}
    />
  );
};
