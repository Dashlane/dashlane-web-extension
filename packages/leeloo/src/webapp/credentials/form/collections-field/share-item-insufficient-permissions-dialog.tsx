import { DialogFooter } from "@dashlane/ui-components";
import { SimpleDialog } from "../../../../libs/dashlane-style/dialogs/simple/simple-dialog";
import { SimpleDialogHeader } from "../../../../libs/dashlane-style/dialogs/simple/simple-dialog-header";
import useTranslate from "../../../../libs/i18n/useTranslate";
interface Props {
  onClose: () => void;
}
const I18N_KEYS = {
  TITLE: "webapp_sharing_item_insufficient_permission_dialog_title",
  DESCRIPTION: "webapp_sharing_item_insufficient_permission_dialog_description",
  CANCEL: "_common_action_cancel",
};
export const ShareItemInsufficientPermissionsDialog = ({ onClose }: Props) => {
  const { translate } = useTranslate();
  return (
    <SimpleDialog
      onRequestClose={onClose}
      isOpen
      disableBackgroundPanelClose
      disableOutsideClickClose
      showCloseIcon
      title={
        <SimpleDialogHeader>{translate(I18N_KEYS.TITLE)}</SimpleDialogHeader>
      }
      footer={
        <DialogFooter
          secondaryButtonTitle={translate(I18N_KEYS.CANCEL)}
          secondaryButtonOnClick={onClose}
          secondaryButtonProps={{ autoFocus: true }}
        />
      }
    >
      <div sx={{ maxWidth: "480px", padding: 0, margin: 0 }}>
        {translate(I18N_KEYS.DESCRIPTION)}
      </div>
    </SimpleDialog>
  );
};
