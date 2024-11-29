import { useState } from "react";
import { LinkButton, Paragraph, Toggle } from "@dashlane/design-system";
import { SettingsSection } from "../settings-section/settings-section";
import { usePinCodeStatus } from "./hooks/use-pin-code-status";
import { PinCodeActivationFlowContainer } from "./activate-pin-code-flow-container";
import { PinCodeDeactivationFlowContainer } from "./deactivate-pin-code-flow-container";
import { HELPCENTER_PIN_UNLOCK_URL } from "../../../../../app/routes/constants";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { useProtectedItemsUnlocker } from "../../../../unlock-items";
import { I18N_KEYS_SECURITY_SETTINGS } from "../../../../unlock-items/constants";
import { LockedItemType } from "../../../../unlock-items/types";
export const I18N_KEYS = {
  PIN_UNLOCK_TITLE: "webapp_account_security_settings_pin_unlock_title",
  PIN_TOGGLE_ARIA_LABEL: "webapp_account_security_settings_pin_unlock_title",
  PIN_UNLOCK_DESCRIPTION:
    "webapp_account_security_settings_pin_unlock_description",
  PIN_UNLOCK_CHANGE_BUTTON:
    "webapp_account_security_settings_pin_unlock_change_button",
  LEARN_MORE_LINK: "webapp_account_security_settings_pin_unlock_help_link",
};
interface Props {
  isMPUser: boolean;
}
enum PinUnlockFlowType {
  Activation,
  Deactivation,
}
export const PinUnlockSection = ({ isMPUser }: Props) => {
  const { translate } = useTranslate();
  const { isPinCodeEnabled, isPinCodeStatusLoading } = usePinCodeStatus();
  const { areProtectedItemsUnlocked, openProtectedItemsUnlocker } =
    useProtectedItemsUnlocker();
  const [currentFlow, setCurrentFlow] = useState<PinUnlockFlowType | undefined>(
    undefined
  );
  const onToggleSettingChange = () => {
    const togglePinCodeSetting = () =>
      setCurrentFlow(
        isPinCodeEnabled
          ? PinUnlockFlowType.Deactivation
          : PinUnlockFlowType.Activation
      );
    if (!areProtectedItemsUnlocked) {
      openProtectedItemsUnlocker({
        itemType: LockedItemType.SecuritySettings,
        options: I18N_KEYS_SECURITY_SETTINGS,
        successCallback: togglePinCodeSetting,
      });
      return;
    }
    togglePinCodeSetting();
  };
  const PinCodeSetting = () => (
    <SettingsSection
      sectionTitle={translate(I18N_KEYS.PIN_UNLOCK_TITLE)}
      action={
        <Toggle
          id="pin-unlock-toggle"
          aria-label={translate(I18N_KEYS.PIN_TOGGLE_ARIA_LABEL)}
          checked={isPinCodeEnabled}
          disabled={
            isPinCodeStatusLoading ||
            !!currentFlow ||
            (isPinCodeEnabled && !isMPUser)
          }
          onChange={onToggleSettingChange}
        />
      }
    >
      <Paragraph
        textStyle="ds.body.standard.regular"
        color="ds.text.neutral.standard"
        sx={{ marginBottom: "8px" }}
      >
        {translate(I18N_KEYS.PIN_UNLOCK_DESCRIPTION)}
      </Paragraph>
      <LinkButton href={HELPCENTER_PIN_UNLOCK_URL} isExternal>
        {translate(I18N_KEYS.LEARN_MORE_LINK)}
      </LinkButton>
    </SettingsSection>
  );
  switch (currentFlow) {
    case PinUnlockFlowType.Activation:
      return (
        <>
          <PinCodeSetting />
          <PinCodeActivationFlowContainer
            onComplete={() => setCurrentFlow(undefined)}
            onCancel={() => setCurrentFlow(undefined)}
          />
        </>
      );
    case PinUnlockFlowType.Deactivation:
      return (
        <>
          <PinCodeSetting />
          <PinCodeDeactivationFlowContainer
            onComplete={() => setCurrentFlow(undefined)}
            onCancel={() => setCurrentFlow(undefined)}
          />
        </>
      );
    default:
      return <PinCodeSetting />;
  }
};
