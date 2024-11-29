import { useState } from "react";
import { Dialog } from "@dashlane/design-system";
import useTranslate from "../../libs/i18n/useTranslate";
export interface DialogProps {
  title: string;
  body: string;
  primaryActionLabel: string;
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}
const I18N_KEYS = {
  DIALOG_CANCEL: "sso_confidential_enable_nitro_sso_confirm_dialog_cancel",
};
export const ConfirmDialog = ({
  title,
  body,
  primaryActionLabel,
  onConfirm,
  onCancel,
}: DialogProps) => {
  const { translate } = useTranslate();
  const [isConfirming, setIsConfirming] = useState(false);
  const handleConfirm = async () => {
    try {
      setIsConfirming(true);
      await onConfirm();
    } catch {
      setIsConfirming(false);
    }
  };
  return (
    <Dialog
      closeActionLabel={translate(I18N_KEYS.DIALOG_CANCEL)}
      title={title}
      isOpen
      onClose={onCancel}
      actions={{
        primary: {
          children: primaryActionLabel,
          onClick: handleConfirm,
          disabled: isConfirming,
          isLoading: isConfirming,
        },
        secondary: {
          children: translate(I18N_KEYS.DIALOG_CANCEL),
          onClick: onCancel,
          disabled: isConfirming,
        },
      }}
    >
      {body}
    </Dialog>
  );
};
