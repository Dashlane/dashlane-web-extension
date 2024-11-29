import useTranslate from "../../../../libs/i18n/useTranslate";
import { TeamDomainsPolicySetting } from "./team-domains-policy-setting";
import { SettingFieldProps, SettingHeader } from "../types";
import { PolicySettingsWrapper } from "../components/policy-settings-wrapper";
import { SettingsGroupHeading } from "../../components/layout/settings-group-heading";
import { DisableSmartSpaceManagementInfobox } from "./disable-smart-space-management-infobox";
import { SmartSpaceManagementDisabledInfobox } from "./smart-space-management-disabled-infobox";
import { EnableForcedDomainSetting } from "./enable-forced-domain-setting";
import { EnableRemoveForcedContentSetting } from "./enable-remove-forced-content-setting";
const I18N_KEYS = {
  HEADER: "team_settings_header_team_space_options",
};
type SmartSpaceManagementPolicyProps = SettingFieldProps & {
  showQuickDisableOfSmartSpaceManagement: boolean;
};
export const SmartSpaceManagementPolicy = (
  props: SmartSpaceManagementPolicyProps
) => {
  const { translate } = useTranslate();
  const { showQuickDisableOfSmartSpaceManagement, policies } = props;
  const header: SettingHeader = {
    type: "header",
    label: translate(I18N_KEYS.HEADER),
  };
  const isDiscontinuedAfterTrialAndSmartManagementIsDisabled =
    showQuickDisableOfSmartSpaceManagement &&
    !policies?.enableForcedDomains &&
    !policies?.enableRemoveForcedContent;
  const shouldShowDisableSmartSpaceManagementInfobox =
    showQuickDisableOfSmartSpaceManagement &&
    (policies?.enableForcedDomains || policies?.enableRemoveForcedContent);
  return (
    <PolicySettingsWrapper>
      <SettingsGroupHeading header={header} />
      {shouldShowDisableSmartSpaceManagementInfobox && (
        <DisableSmartSpaceManagementInfobox />
      )}
      {isDiscontinuedAfterTrialAndSmartManagementIsDisabled && (
        <SmartSpaceManagementDisabledInfobox />
      )}
      <TeamDomainsPolicySetting
        isDiscontinuedAfterTrialAndSmartManagementIsDisabled={
          isDiscontinuedAfterTrialAndSmartManagementIsDisabled
        }
        {...props}
      />
      <EnableForcedDomainSetting
        isDiscontinuedAfterTrialAndSmartManagementIsDisabled={
          isDiscontinuedAfterTrialAndSmartManagementIsDisabled
        }
        {...props}
      />
      <EnableRemoveForcedContentSetting
        isDiscontinuedAfterTrialAndSmartManagementIsDisabled={
          isDiscontinuedAfterTrialAndSmartManagementIsDisabled
        }
        {...props}
      />
    </PolicySettingsWrapper>
  );
};
