import { DropdownItem } from "@dashlane/design-system";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useAccountSettingsPanelContext } from "../../../account/account-settings-panel-context";
const I18N_KEYS = {
  SETTINGS: "manage_subscription_account_menu_settings",
};
export const Settings = () => {
  const { translate } = useTranslate();
  const { openAccountPanel } = useAccountSettingsPanelContext();
  return (
    <DropdownItem
      data-testid="settingsItem"
      onSelect={openAccountPanel}
      label={translate(I18N_KEYS.SETTINGS)}
      leadingIcon="SettingsOutlined"
    />
  );
};
