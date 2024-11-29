import { useState } from "react";
import { PageView } from "@dashlane/hermes";
import { AlertSeverity } from "@dashlane/ui-components";
import { PersonalSettings } from "@dashlane/communication";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import {
  IndeterminateLoader,
  Paragraph,
  Toggle,
} from "@dashlane/design-system";
import { useProtectedItemsUnlocker } from "../../../../unlock-items";
import { SettingsSection } from "../settings-section/settings-section";
import { useAlert } from "../../../../../libs/alert-notifications/use-alert";
import { carbonConnector } from "../../../../../libs/carbon/connector";
import { useProtectPasswordsSetting } from "../../../../../libs/carbon/hooks/useProtectPasswordsSetting";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { logPageView } from "../../../../../libs/logs/logEvent";
import {
  logChangeMasterPasswordProtectSetting,
  logUnlockMasterPasswordProtectSetting,
} from "../../../../unlock-items/logs";
import { LockedItemType } from "../../../../unlock-items/types";
type SupportedKeys = Extract<
  keyof PersonalSettings,
  "ProtectIDs" | "ProtectPayments" | "ProtectPasswords"
>;
const I18N_KEYS: Record<string, string> = {
  HEADING: "webapp_account_security_settings_master_password_options_title",
  SUBHEADING:
    "webapp_account_security_settings_master_password_options_subtitle",
  UPDATE_ERROR:
    "webapp_account_security_settings_master_password_options_error",
  VIEW_CREDENTIALS:
    "webapp_account_security_settings_master_password_options_require_passwords",
  VIEW_CREDENTIALS_TOGGLE_ARIA_LABEL:
    "webapp_account_security_settings_master_password_options_require_passwords_toggle_aria_label",
  GENERIC_ERROR: "_common_generic_error",
  VIEW_PAYMENTS:
    "webapp_account_security_settings_master_password_options_require_payments",
  AUTOFILL_PAYMENTS:
    "webapp_account_security_settings_master_password_options_autofill_payments",
};
type I18nKeysForSecuritySetting = {
  alert: string;
  dialogKeys: unknown;
};
const I18N_KEYS_SETTINGS_ON: {
  [type in SupportedKeys]?: I18nKeysForSecuritySetting;
} = {
  ProtectPasswords: {
    alert:
      "webapp_account_security_settings_master_password_options_require_passwords_alert_enabled",
    dialogKeys: {
      title: "webapp_lock_items_require_master_password_for_passwords_title_on",
      subtitle:
        "webapp_lock_items_require_master_password_for_passwords_subtitle_on",
      confirm: "webapp_lock_items_require_master_password_confirm_on",
    },
  },
};
const I18N_KEYS_SETTINGS_OFF: {
  [type in SupportedKeys]?: I18nKeysForSecuritySetting;
} = {
  ProtectPasswords: {
    alert:
      "webapp_account_security_settings_master_password_options_require_passwords_alert_disabled",
    dialogKeys: {
      title:
        "webapp_lock_items_require_master_password_for_passwords_title_off",
      subtitle:
        "webapp_lock_items_require_master_password_for_passwords_subtitle_off",
      confirm: "webapp_lock_items_require_master_password_confirm_off",
    },
  },
};
export const MasterPasswordSettings = () => {
  const { translate } = useTranslate();
  const alert = useAlert();
  const protectPasswordsSetting = useProtectPasswordsSetting();
  const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } =
    useProtectedItemsUnlocker();
  const [updatingSettings, setUpdatingSettings] = useState(false);
  const successCallback = async (
    successAlert: string,
    settingChecked: boolean
  ) => {
    setUpdatingSettings(true);
    await carbonConnector.updateProtectPasswordsSetting(settingChecked);
    setUpdatingSettings(false);
    alert.showAlert(translate(successAlert), AlertSeverity.SUCCESS);
    logPageView(
      settingChecked
        ? PageView.SettingsSecurityProtectWithMasterPasswordEnable
        : PageView.SettingsSecurityProtectWithMasterPasswordDisable
    );
    logPageView(
      settingChecked
        ? PageView.SettingsSecurityProtectWithMasterPasswordCredentialsEnable
        : PageView.SettingsSecurityProtectWithMasterPasswordCredentialsDisable
    );
    logChangeMasterPasswordProtectSetting(settingChecked);
  };
  const handleToggleOnClick = (args: Partial<PersonalSettings>) => {
    const apiKey = Object.keys(args)[0];
    const settingChecked = args[apiKey];
    const i18Keys = settingChecked
      ? I18N_KEYS_SETTINGS_ON
      : I18N_KEYS_SETTINGS_OFF;
    const successAlert = i18Keys[apiKey].alert;
    if (!areProtectedItemsUnlocked) {
      openProtectedItemsUnlocker({
        itemType: LockedItemType.SecuritySettings,
        options: {
          fieldsKeys: i18Keys[apiKey].dialogKeys,
          translated: false,
        },
        successCallback: () => successCallback(successAlert, settingChecked),
      });
      logUnlockMasterPasswordProtectSetting();
    } else {
      successCallback(successAlert, settingChecked);
    }
  };
  return (
    <SettingsSection sectionTitle={translate(I18N_KEYS.HEADING)}>
      <Paragraph
        textStyle="ds.body.standard.regular"
        color="ds.text.neutral.standard"
      >
        {translate(I18N_KEYS.SUBHEADING)}
      </Paragraph>
      {protectPasswordsSetting.status === DataStatus.Loading ? (
        <IndeterminateLoader
          mood="brand"
          aria-busy="true"
          aria-live="polite"
          size="xlarge"
        />
      ) : null}
      {protectPasswordsSetting.status === DataStatus.Success ? (
        <ul
          sx={{
            mt: "8px",
          }}
        >
          <li
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Paragraph
              textStyle="ds.body.standard.regular"
              color="ds.text.positive.standard"
            >
              {translate(I18N_KEYS.VIEW_CREDENTIALS)}
            </Paragraph>
            <Toggle
              aria-label={translate(
                I18N_KEYS.VIEW_CREDENTIALS_TOGGLE_ARIA_LABEL
              )}
              disabled={updatingSettings}
              checked={protectPasswordsSetting.data}
              onChange={() =>
                handleToggleOnClick({
                  ProtectPasswords: !protectPasswordsSetting.data,
                })
              }
            />
          </li>
        </ul>
      ) : null}
    </SettingsSection>
  );
};
