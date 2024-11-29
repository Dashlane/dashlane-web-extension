import { useEffect } from "react";
import { DialogBody, DialogFooter } from "@dashlane/ui-components";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logTwoFactorAuthenticationEnableQRCodelPageView } from "../../logs/enable-flow-logs";
import { QRCodeForm } from "./qr-code-form";
interface Props {
  handleClickOnSubmit: () => void;
  handleClickOnBack: () => void;
  uri: string;
  seed: string;
}
const I18N_KEYS = {
  BACK_BUTTON:
    "webapp_account_security_settings_two_factor_authentication_qr_code_back_button",
  CONTINUE_BUTTON:
    "webapp_account_security_settings_two_factor_authentication_qr_code_continue_button",
};
export const TwoFactorAuthenticationQRCodeDialog = ({
  handleClickOnSubmit,
  handleClickOnBack,
  uri,
  seed,
}: Props) => {
  const { translate } = useTranslate();
  useEffect(() => {
    logTwoFactorAuthenticationEnableQRCodelPageView();
  }, []);
  return (
    <div
      sx={{
        maxWidth: "480px",
      }}
    >
      <DialogBody>
        <QRCodeForm uri={uri} seed={seed} />
      </DialogBody>
      <DialogFooter
        primaryButtonTitle={translate(I18N_KEYS.CONTINUE_BUTTON)}
        primaryButtonProps={{
          type: "button",
          autoFocus: true,
        }}
        primaryButtonOnClick={() => handleClickOnSubmit()}
        secondaryButtonTitle={translate(I18N_KEYS.BACK_BUTTON)}
        secondaryButtonOnClick={() => handleClickOnBack()}
        secondaryButtonProps={{
          id: "two-factor-authentication-qr-code-dialog-back-button",
        }}
      />
    </div>
  );
};
