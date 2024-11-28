import { jsx } from "@dashlane/design-system";
import { Paragraph } from "@dashlane/ui-components";
import Dialog from "../../components/dialog";
import useTranslate from "../../libs/i18n/useTranslate";
import styles from "./styles.css";
const I18N_KEYS = {
  TITLE: "account_recovery_request_start_title",
  BODY: "account_recovery_request_start_body",
  CONFIRM: "account_recovery_request_start_confirm_button",
  CANCEL: "account_recovery_request_start_cancel_button",
};
interface Props {
  onStartAccountRecovery: () => void;
  onDismiss: () => void;
  isVisible: boolean;
}
export const AccountRecoveryRequestStartDialog: React.FunctionComponent<
  Props
> = ({ onStartAccountRecovery, onDismiss, isVisible }: Props) => {
  const { translate } = useTranslate();
  return (
    <Dialog
      confirmLabel={translate(I18N_KEYS.CONFIRM)}
      onConfirm={onStartAccountRecovery}
      cancelLabel={translate(I18N_KEYS.CANCEL)}
      onCancel={onDismiss}
      visible={isVisible}
      autoFocusAction="confirm"
    >
      <header className={styles.dialogHeader}>
        {translate(I18N_KEYS.TITLE)}
      </header>
      <Paragraph sx={{ marginBottom: "16px" }} color="ds.text.brand.standard">
        {translate(I18N_KEYS.BODY)}
      </Paragraph>
    </Dialog>
  );
};
