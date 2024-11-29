import { Button, useColorMode } from "@dashlane/design-system";
import TwoFAIllustrationLight from "@dashlane/design-system/assets/illustrations/additional-protection-2FA@2x-light.webp";
import TwoFAIllustrationDark from "@dashlane/design-system/assets/illustrations/additional-protection-2FA@2x-dark.webp";
import { PinEnforcementLayout } from "../components/pin-code-enforcement-layout";
import { EnterPinCodeEnforcementScreen } from "../components/enter-pin-code-enforcement-screen";
import { ConfirmPinCodeEnforcementScreen } from "../components/confirm-pin-code-enforcement-screen";
import {
  PinEnforcementStep,
  usePinEnforcement,
} from "../hooks/use-pin-enforcement";
import styles from "./../styles.css";
import useTranslate from "../../../../../libs/i18n/useTranslate";
const I18N_KEYS = {
  BACK_BUTTON_LABEL: "webapp_auth_panel_standalone_account_creation_back_label",
};
export const PinEnforcementContainer = () => {
  const { translate } = useTranslate();
  const [colorMode] = useColorMode();
  const illustrationSource =
    colorMode === "dark" ? TwoFAIllustrationDark : TwoFAIllustrationLight;
  const {
    loginEmail,
    pinCode,
    pinEnforcementStep,
    setPinCode,
    setPinEnforcementStep,
    activate,
  } = usePinEnforcement();
  return (
    <PinEnforcementLayout illustrationSource={illustrationSource}>
      {pinEnforcementStep === PinEnforcementStep.ConfirmPinCode ? (
        <Button
          intensity="supershy"
          layout="iconLeading"
          icon="ArrowLeftOutlined"
          type="button"
          onClick={() => setPinEnforcementStep(PinEnforcementStep.EnterPinCode)}
          data-testid="back"
          className={styles.backButton}
        >
          {translate(I18N_KEYS.BACK_BUTTON_LABEL)}
        </Button>
      ) : null}
      <div className={styles.rightContent}>
        {pinEnforcementStep === PinEnforcementStep.EnterPinCode ? (
          <EnterPinCodeEnforcementScreen
            loginEmail={loginEmail}
            onEnterPin={(pin: string) => {
              setPinCode(pin);
              setPinEnforcementStep(PinEnforcementStep.ConfirmPinCode);
            }}
          />
        ) : null}
        {pinEnforcementStep === PinEnforcementStep.ConfirmPinCode ? (
          <ConfirmPinCodeEnforcementScreen
            loginEmail={loginEmail}
            pinCode={pinCode}
            onActivatePin={activate}
          />
        ) : null}
      </div>
    </PinEnforcementLayout>
  );
};
