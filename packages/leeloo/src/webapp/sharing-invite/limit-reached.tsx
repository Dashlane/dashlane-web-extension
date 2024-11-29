import { Dialog } from "@dashlane/ui-components";
import useTranslate from "../../libs/i18n/useTranslate";
import {
  SharingLimitReachedDialogContent,
  SharingLimitReachedDialogContentProps,
} from "./limit-reached-dialog-content";
const I18N_KEYS = {
  DISMISS: "_common_dialog_dismiss_button",
};
export const SharingLimitReachedDialog = (
  props: SharingLimitReachedDialogContentProps
) => {
  const { translate } = useTranslate();
  return (
    <Dialog
      isOpen
      onClose={props.closeDialog}
      closeIconName={translate(I18N_KEYS.DISMISS)}
    >
      <SharingLimitReachedDialogContent {...props} />
    </Dialog>
  );
};
