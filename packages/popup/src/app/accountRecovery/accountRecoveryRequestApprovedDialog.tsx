import { jsx } from "@dashlane/design-system";
import { AllGoodIcon, Paragraph } from "@dashlane/ui-components";
import Dialog from "../../components/dialog";
import useTranslate from "../../libs/i18n/useTranslate";
import styles from "./styles.css";
const I18N_KEYS = {
  TITLE: "account_recovery_request_approved_title",
  BODY: "account_recovery_request_approved_body",
  CONFIRM: "account_recovery_request_approved_confirm_button",
};
interface Props {
  isVisible: boolean;
  onRecoverUserAccount: () => void;
}
export const AccountRecoveryRequestApprovedDialog: React.FunctionComponent<
  Props
> = ({ isVisible, onRecoverUserAccount }: Props) => {
  const { translate } = useTranslate();
  return (
    <Dialog
      confirmLabel={translate(I18N_KEYS.CONFIRM)}
      onConfirm={onRecoverUserAccount}
      visible={isVisible}
    >
      <div className={styles.icon}>
        <AllGoodIcon
          size={62}
          color="ds.container.expressive.brand.catchy.idle"
        />
      </div>

      <header className={styles.dialogHeader}>
        {translate(I18N_KEYS.TITLE)}
      </header>
      <Paragraph sx={{ marginBottom: "16px" }} color="ds.text.brand.standard">
        {translate(I18N_KEYS.BODY)}
      </Paragraph>
    </Dialog>
  );
};
