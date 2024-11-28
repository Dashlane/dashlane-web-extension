import { jsx } from "@dashlane/design-system";
import { CrossCircleIcon, Paragraph } from "@dashlane/ui-components";
import Dialog from "../../components/dialog";
import useTranslate from "../../libs/i18n/useTranslate";
import styles from "./styles.css";
const I18N_KEYS = {
  TITLE: "account_recovery_request_refused_title",
  BODY: "account_recovery_request_refused_body",
  CONFIRM: "account_recovery_request_refused_confirm_button",
  CLOSE: "account_recovery_request_refused_close_button",
};
interface Props {
  onDismiss: () => void;
  onSendNewRequest: () => void;
  isVisible: boolean;
}
export const AccountRecoveryRequestRefusedDialog: React.FunctionComponent<
  Props
> = ({ onSendNewRequest, onDismiss, isVisible }: Props) => {
  const { translate } = useTranslate();
  return (
    <Dialog
      confirmLabel={translate(I18N_KEYS.CONFIRM)}
      onConfirm={onDismiss}
      cancelLabel={translate(I18N_KEYS.CLOSE)}
      onCancel={onSendNewRequest}
      visible={isVisible}
    >
      <div className={styles.icon}>
        <CrossCircleIcon
          size={62}
          color="ds.container.expressive.danger.catchy.idle"
        />
      </div>

      <header className={styles.dialogHeader}>
        {translate(I18N_KEYS.TITLE)}
      </header>
      <Paragraph sx={{ marginBottom: "16px" }} color="ds.text.danger.standard">
        {translate(I18N_KEYS.BODY)}
      </Paragraph>
    </Dialog>
  );
};
