import { Button } from "@dashlane/design-system";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogTitle,
  Paragraph,
} from "@dashlane/ui-components";
import React, { ReactNode, useState } from "react";
import useTranslate from "../../../libs/i18n/useTranslate";
const I18N_VALUES = {
  CONTINUE_CTA: "Yes, clear setup",
};
const I18N_KEYS = {
  CANCEL: "_common_action_cancel",
  GENERIC_ERROR: "_common_generic_error",
};
interface ClearSettingsConfirmationDialogProps {
  onClose: () => void;
  onConfirm: () => void;
  titleText: ReactNode;
  bodyText: ReactNode;
}
export const ClearSettingsConfirmationDialog = ({
  onClose,
  onConfirm,
  titleText,
  bodyText,
}: ClearSettingsConfirmationDialogProps) => {
  const { translate } = useTranslate();
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmingError, setConfirmingError] = useState<string | null>(null);
  const handleClose = () => {
    onClose();
  };
  const handleConfirm = async () => {
    setIsConfirming(true);
    setConfirmingError(null);
    try {
      await onConfirm();
      setIsConfirming(false);
      onClose();
    } catch (e) {
      setConfirmingError(
        e instanceof Error ? e.message : translate(I18N_KEYS.GENERIC_ERROR)
      );
      setIsConfirming(false);
    }
  };
  const closeText = translate(I18N_KEYS.CANCEL);
  return (
    <Dialog
      isOpen
      disableOutsideClickClose
      disableScrolling
      closeIconName={closeText}
      onClose={onClose}
    >
      <DialogTitle title={titleText} />
      <DialogBody>
        <Paragraph
          color={
            confirmingError
              ? "ds.text.danger.standard"
              : "ds.text.neutral.standard"
          }
        >
          {confirmingError ?? bodyText}
        </Paragraph>
      </DialogBody>
      <DialogFooter>
        <Button
          sx={{ mr: "12px" }}
          mood="neutral"
          intensity="quiet"
          onClick={handleClose}
          disabled={isConfirming}
        >
          {closeText}
        </Button>
        <Button
          mood="brand"
          intensity="catchy"
          onClick={handleConfirm}
          isLoading={isConfirming}
          disabled={isConfirming}
        >
          {I18N_VALUES.CONTINUE_CTA}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
