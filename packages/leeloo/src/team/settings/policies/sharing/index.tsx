import useTranslate from "../../../../libs/i18n/useTranslate";
import { NamedRoutes } from "../../../../app/routes/types";
import { RestrictSharingPaywallDetails } from "../../../helpers/use-restrict-sharing-paywall";
import { SettingFieldProps, SettingHeader } from "../types";
import { PolicySettingsWrapper } from "../components/policy-settings-wrapper";
import { SettingsGroupHeading } from "../../components/layout/settings-group-heading";
import { AllowSharingSetting } from "./allow-sharing-setting";
import { RestrictSharingToTeamSetting } from "./restrict-sharing-to-team-setting";
const I18N_KEYS = {
  HEADER: "team_setting_header_sharing",
};
type SharingPolicyProps = SettingFieldProps & {
  hasTrialBusinessPaywall: boolean;
  hasExcludedPolicy: (policy: string) => boolean;
  isTeamDiscontinuedAfterTrial: boolean;
  restrictSharingPaywallDetails: RestrictSharingPaywallDetails;
  routes: NamedRoutes;
};
export const SharingPolicy = (props: SharingPolicyProps) => {
  const { translate } = useTranslate();
  const header: SettingHeader = {
    type: "header",
    label: translate(I18N_KEYS.HEADER),
  };
  return (
    <PolicySettingsWrapper>
      <SettingsGroupHeading header={header} />
      <AllowSharingSetting {...props} />
      <RestrictSharingToTeamSetting {...props} />
    </PolicySettingsWrapper>
  );
};
