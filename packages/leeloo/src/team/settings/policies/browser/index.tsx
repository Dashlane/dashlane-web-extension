import useTranslate from "../../../../libs/i18n/useTranslate";
import { SettingFieldProps, SettingHeader } from "../types";
import { PolicySettingsWrapper } from "../components/policy-settings-wrapper";
import { SettingsGroupHeading } from "../../components/layout/settings-group-heading";
import { TurnOffAutoLoginAndAutofillSetting } from "./turn-off-auto-login-and-autofill-setting";
const I18N_KEYS = {
  HEADER: "team_settings_header_browser_settings",
};
type BrowserPolicyProps = SettingFieldProps & {
  hasExcludedPolicy: (policy: string) => boolean;
  hasTrialBusinessPaywall: boolean;
  isTeamDiscontinuedAfterTrial: boolean;
};
export const BrowserPolicy = (props: BrowserPolicyProps) => {
  const { translate } = useTranslate();
  const header: SettingHeader = {
    type: "header",
    label: translate(I18N_KEYS.HEADER),
  };
  return (
    <PolicySettingsWrapper>
      <SettingsGroupHeading header={header} />
      <TurnOffAutoLoginAndAutofillSetting {...props} />
    </PolicySettingsWrapper>
  );
};
