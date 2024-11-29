import classnames from "classnames";
import { useState } from "react";
import { Dialog, ExpressiveIcon } from "@dashlane/design-system";
import useTranslate from "../../../../../../../libs/i18n/useTranslate";
import { allIgnoreClickOutsideClassName } from "../../../../../../../webapp/variables";
import { LostRecoveryKeyDialogContent } from "./lost-recovery-key-dialog-content";
import { UseRecoveryKeyDialogContent } from "./use-recovery-key-dialog-content";
const I18N_KEYS = {
  BUTTON_CLOSE_DIALOG: "_common_dialog_dismiss_button",
};
interface Props {
  onClose: () => void;
}
export const AccountRecoveryWithKeyDialog = ({ onClose }: Props) => {
  const { translate } = useTranslate();
  const [userLostKey, setUserLostKey] = useState(false);
  return (
    <Dialog
      dialogClassName={classnames(allIgnoreClickOutsideClassName)}
      isOpen
      closeActionLabel={translate(I18N_KEYS.BUTTON_CLOSE_DIALOG)}
      onClose={onClose}
      decorationSlot={
        <ExpressiveIcon name="RecoveryKeyOutlined" size="xlarge" mood="brand" />
      }
    >
      {!userLostKey ? (
        <UseRecoveryKeyDialogContent onLostKey={() => setUserLostKey(true)} />
      ) : (
        <LostRecoveryKeyDialogContent />
      )}
    </Dialog>
  );
};
