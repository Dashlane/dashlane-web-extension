import { DialogBody, DialogFooter } from "@dashlane/ui-components";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { useEffect } from "react";
import { logTwoFactorAuthenticationEnableBackupCodesPageView } from "../../logs/enable-flow-logs";
import { BackupCodesForm } from "./backup-codes-form";
interface Props {
  handleClickOnSubmit: () => void;
  recoveryKeys: string[];
}
const I18N_KEYS = {
  DONE_BUTTON:
    "webapp_account_security_settings_two_factor_authentication_backup_codes_done_button",
};
export const TwoFactorAuthenticationBackupCodesDialog = ({
  handleClickOnSubmit,
  recoveryKeys,
}: Props) => {
  const { translate } = useTranslate();
  useEffect(() => {
    logTwoFactorAuthenticationEnableBackupCodesPageView();
  }, []);
  return (
    <div
      sx={{
        maxWidth: "480px",
      }}
    >
      <DialogBody>
        <BackupCodesForm backupCodes={recoveryKeys} />
      </DialogBody>
      <DialogFooter
        primaryButtonTitle={translate(I18N_KEYS.DONE_BUTTON)}
        primaryButtonProps={{
          type: "button",
          autoFocus: true,
        }}
        primaryButtonOnClick={() => handleClickOnSubmit()}
      />
    </div>
  );
};
