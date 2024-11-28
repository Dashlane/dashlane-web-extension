import React, { MouseEventHandler } from "react";
import { DropdownElement } from "@dashlane/ui-components";
import useTranslate from "../../../../../../../libs/i18n/useTranslate";
import { ConfirmLabelMode } from "../../../../../../protected-items-unlocker/master-password-dialog";
import useDisplayMasterPasswordDialog from "../../../../../../protected-items-unlocker/useProtectedItemsUnlocker";
import { useOnCopyAction } from "./useOnCopyAction";
import { CopyDropdownElementProps } from "./copy-dropdown-element";
interface ProtectedCopyDropdownElementProps extends CopyDropdownElementProps {
  confirmLabelMode: ConfirmLabelMode;
  showNeverAskOption?: boolean;
  credentialUrl?: string;
}
const ProtectedCopyDropdownElement = ({
  copyValue,
  credentialId,
  field,
  itemType,
  I18N_KEY_text,
  I18N_KEY_notification,
  confirmLabelMode,
  showNeverAskOption = false,
  credentialUrl,
}: ProtectedCopyDropdownElementProps) => {
  const { translate } = useTranslate();
  const onCopyAction = useOnCopyAction();
  const { openProtectedItemsUnlocker, areProtectedItemsUnlocked } =
    useDisplayMasterPasswordDialog();
  const copyProtected = () => {
    openProtectedItemsUnlocker({
      confirmLabelMode: confirmLabelMode,
      onSuccess: () => {
        onCopyAction(
          copyValue,
          credentialId,
          field,
          itemType,
          translate(I18N_KEY_notification),
          true,
          credentialUrl
        );
      },
      showNeverAskOption: showNeverAskOption,
      credentialId: credentialId,
    });
  };
  const copy: MouseEventHandler = (event) => {
    if (areProtectedItemsUnlocked) {
      onCopyAction(
        copyValue,
        credentialId,
        field,
        itemType,
        translate(I18N_KEY_notification)
      );
    } else {
      copyProtected();
    }
  };
  return (
    <DropdownElement fullWidth onClick={copy}>
      {translate(I18N_KEY_text)}
    </DropdownElement>
  );
};
export default ProtectedCopyDropdownElement;
