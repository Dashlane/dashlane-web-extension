import { useState } from "react";
import { Button, Flex, useToast } from "@dashlane/design-system";
import { useFeatureFlip } from "@dashlane/framework-react";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { OtpCodeComponent, OtpCodeComponentProps } from "./otp-code.component";
import { RemoveOtpCodeDialog } from "./remove-otp-code-dialog";
const I18N_KEYS = {
  SET_UP_BUTTON: "webapp_credential_edition_field_otp_setup_title",
  REMOVE_SUCCESS_TOAST: "webapp_credential_otp_code_removed_success_toast",
  UNDO_BUTTON: "webapp_credential_otp_code_removed_success_toast_undo_button",
};
export type CredentialOtpFieldProps = OtpCodeComponentProps & {
  onSubmit?: () => void;
  onUndoDelete?: (otpUrl: string) => void;
  isEditable: boolean;
  setHasOpenedDialogs?: (value: boolean) => void;
};
export const CredentialOtpField = ({
  secretOrUrl,
  isEditable,
  onCopy,
  onSubmit,
  onDelete,
  onUndoDelete,
  setHasOpenedDialogs,
}: CredentialOtpFieldProps) => {
  const { translate } = useTranslate();
  const { showToast, closeToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const closeConfirmRemoveDialog = () => {
    setHasOpenedDialogs?.(false);
    setIsOpen(false);
  };
  const openConfirmRemoveDialog = () => {
    setHasOpenedDialogs?.(true);
    setIsOpen(true);
  };
  const handleDelete = () => {
    onDelete();
    const successToastId = showToast({
      description: translate(I18N_KEYS.REMOVE_SUCCESS_TOAST),
      action: {
        label: translate(I18N_KEYS.UNDO_BUTTON),
        onClick: () => {
          onUndoDelete?.(secretOrUrl);
          closeToast(successToastId);
        },
      },
    });
    closeConfirmRemoveDialog();
  };
  const otpSetupEnabled = useFeatureFlip("sharingVault_web_otp_setup_dev");
  if (secretOrUrl) {
    return (
      <>
        <OtpCodeComponent
          secretOrUrl={secretOrUrl}
          isEditable={isEditable && !!otpSetupEnabled}
          onCopy={onCopy}
          onDelete={openConfirmRemoveDialog}
        />
        <RemoveOtpCodeDialog
          onCancel={closeConfirmRemoveDialog}
          onSubmit={handleDelete}
          isOpen={isOpen}
        />
      </>
    );
  }
  if (isEditable && otpSetupEnabled && onSubmit) {
    return (
      <Flex justifyContent="flex-end">
        <Button
          sx={{ mt: "8px" }}
          size="small"
          icon="ArrowRightOutlined"
          layout="iconTrailing"
          intensity="supershy"
          mood="brand"
          onClick={onSubmit}
        >
          {translate(I18N_KEYS.SET_UP_BUTTON)}
        </Button>
      </Flex>
    );
  }
  return null;
};
