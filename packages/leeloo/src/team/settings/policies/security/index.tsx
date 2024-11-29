import useTranslate from "../../../../libs/i18n/useTranslate";
import { NamedRoutes } from "../../../../app/routes/types";
import { UseBuyOrUpgradePaywallDetailsResult } from "../../../helpers/use-buy-or-upgrade-paywall-details";
import { SettingFieldProps, SettingHeader } from "../types";
import { PolicySettingsWrapper } from "../components/policy-settings-wrapper";
import { SettingsGroupHeading } from "../../components/layout/settings-group-heading";
import { ForceCryptoSetting } from "./force-crypto-setting";
import { Enforce2FASetting } from "./enforce-2fa-setting";
import { AllowExportSetting } from "./allow-export-setting";
import { ForceAutoLogoutSetting } from "./force-auto-logout-setting";
import { LockOnExitSetting } from "./lock-on-exit-setting";
import { AuditLogSetting } from "./audit-log-setting";
import { VPNSetting } from "./vpn-setting";
import { RichIconsSetting } from "./rich-icons-setting";
const I18N_KEYS = {
  HEADER: "team_settings_header_security",
};
type SecurityPolicyProps = SettingFieldProps & {
  hasTrialBusinessPaywall: boolean;
  hasExcludedPolicy: (policy: string) => boolean;
  isPersonalSpaceEnabledViaTeamSetting: boolean;
  isTeamDiscontinuedAfterTrial: boolean;
  routes: NamedRoutes;
  showPaywallInfo: UseBuyOrUpgradePaywallDetailsResult;
};
export const SecurityPolicy = (props: SecurityPolicyProps) => {
  const { translate } = useTranslate();
  const header: SettingHeader = {
    type: "header",
    label: translate(I18N_KEYS.HEADER),
  };
  return (
    <PolicySettingsWrapper>
      <SettingsGroupHeading header={header} />
      <ForceCryptoSetting {...props} />
      <Enforce2FASetting {...props} />
      <AllowExportSetting {...props} />
      <ForceAutoLogoutSetting {...props} />
      <LockOnExitSetting {...props} />
      <AuditLogSetting {...props} />
      <VPNSetting {...props} />
      <RichIconsSetting {...props} />
    </PolicySettingsWrapper>
  );
};
