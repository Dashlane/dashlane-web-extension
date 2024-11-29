import { useState } from "react";
import { Paragraph } from "@dashlane/design-system";
import { Permission } from "@dashlane/sharing-contracts";
import { DialogFooter } from "@dashlane/ui-components";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { SimpleDialog } from "../../../../libs/dashlane-style/dialogs/simple/simple-dialog";
import { SimpleDialogHeader } from "../../../../libs/dashlane-style/dialogs/simple/simple-dialog-header";
import {
  RadioButton,
  RadioButtonGroup,
} from "../../../../libs/dashlane-style/radio-button";
interface Props {
  onSubmit: (itemPermission: Permission, collectionName?: string) => void;
  onClose: () => void;
  collectionName: string;
  itemTitle: string;
}
const I18N_KEYS = {
  TITLE: "webapp_sharing_add_item_to_shared_collection_dialog_title_markup",
  DESCRIPTION:
    "webapp_sharing_add_item_to_shared_collection_dialog_description_markup",
  CONFIRM: "webapp_login_add_item_to_shared_collection_dialog_confirm_button",
  CANCEL: "_common_action_cancel",
  FULL_DETAIL: "webapp_sharing_invite_full_rights_detail",
  FULL_TITLE: "webapp_sharing_invite_full_rights",
  LIMITED_DETAIL_COLLECTION:
    "webapp_collection_sharing_invite_limited_rights_detail",
  LIMITED_TITLE: "webapp_sharing_invite_limited_rights",
};
export const AddSharedCollectionDialog = ({
  onSubmit,
  onClose,
  itemTitle,
  collectionName,
}: Props) => {
  const { translate } = useTranslate();
  const [itemPermission, setItemPermission] = useState(Permission.Limited);
  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    setItemPermission(event.currentTarget.value as Permission);
  };
  return (
    <SimpleDialog
      onRequestClose={onClose}
      isOpen
      disableBackgroundPanelClose
      disableOutsideClickClose
      showCloseIcon
      title={
        <SimpleDialogHeader>
          {translate.markup(I18N_KEYS.TITLE, {
            itemTitle: itemTitle,
          })}
        </SimpleDialogHeader>
      }
      footer={
        <DialogFooter
          secondaryButtonOnClick={onClose}
          secondaryButtonTitle={translate(I18N_KEYS.CANCEL)}
          secondaryButtonProps={{ autoFocus: true }}
          primaryButtonOnClick={() => onSubmit(itemPermission, collectionName)}
          primaryButtonTitle={translate(I18N_KEYS.CONFIRM)}
          primaryButtonProps={{
            disabled: !itemPermission,
            type: "button",
          }}
        />
      }
    >
      <div sx={{ height: "auto" }}>
        <RadioButtonGroup
          groupName="permission"
          value={itemPermission}
          onChange={handleChange}
        >
          <RadioButton value="limited">
            <Paragraph sx={{ mb: "4px", fontWeight: "bold" }}>
              {translate(I18N_KEYS.LIMITED_TITLE)}
            </Paragraph>
            <Paragraph>
              {translate(I18N_KEYS.LIMITED_DETAIL_COLLECTION)}
            </Paragraph>
          </RadioButton>
          <RadioButton value="admin">
            <Paragraph sx={{ mb: "4px", fontWeight: "bold" }}>
              {translate(I18N_KEYS.FULL_TITLE)}
            </Paragraph>
            <Paragraph>{translate(I18N_KEYS.FULL_DETAIL)}</Paragraph>
          </RadioButton>
        </RadioButtonGroup>
      </div>
    </SimpleDialog>
  );
};
