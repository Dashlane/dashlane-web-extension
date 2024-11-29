import React from "react";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import {
  accountRecoveryKeyApi,
  RecoveryMethodsInfoQueryResult,
} from "@dashlane/account-recovery-contracts";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { SettingsSection } from "../settings-section/settings-section";
import { ActivePanel } from "../../security-settings";
import { AccountRecoveryAvailableSection } from "./account-recovery-available-section";
import { AccountRecoveryLoadingSection } from "./account-recovery-loading-section";
export const I18N_KEYS = {
  ACCOUNT_RECOVERY_TITLE:
    "webapp_account_security_settings_account_recovery_section_title",
  ACCOUNT_RECOVERY_DESCRIPTION:
    "webapp_account_security_settings_account_recovery_section_description_markup",
  LOADING_DATA: "webapp_loader_loading",
  NO_ACCOUNT_RECOVERY_METHOD_WARNING_INFOBOX:
    "webapp_account_security_settings_account_recovery_section_warning_info",
  VIEW_OPTIONS:
    "webapp_account_security_settings_account_recovery_section_view_options",
};
const getRecoveryMethodsCount = (
  recoveryMethods: RecoveryMethodsInfoQueryResult
) => Object.values(recoveryMethods).filter(Boolean).length;
interface Props {
  changeActivePanel: (panel: ActivePanel) => void;
}
export const AccountRecoverySettingsSection = ({
  changeActivePanel,
}: Props) => {
  const recoveryMethodsInfo = useModuleQuery(
    accountRecoveryKeyApi,
    "recoveryMethodsInfo"
  );
  const { translate } = useTranslate();
  const handleOpenAccountRecoveryPanel = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();
    changeActivePanel(ActivePanel.AccountRecovery);
  };
  return (
    <SettingsSection sectionTitle={translate(I18N_KEYS.ACCOUNT_RECOVERY_TITLE)}>
      <div data-testid="account-recovery-settings-section">
        {recoveryMethodsInfo.status === DataStatus.Success ? (
          <AccountRecoveryAvailableSection
            recoveryMethodsCount={getRecoveryMethodsCount(
              recoveryMethodsInfo.data
            )}
            openAccountRecoveryPanel={handleOpenAccountRecoveryPanel}
          />
        ) : (
          <AccountRecoveryLoadingSection />
        )}
      </div>
    </SettingsSection>
  );
};
