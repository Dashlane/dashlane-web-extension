import { jsx } from '@dashlane/design-system';
import { ClockOutlinedIcon, Paragraph } from '@dashlane/ui-components';
import Dialog from 'components/dialog';
import useTranslate from 'libs/i18n/useTranslate';
import styles from './styles.css';
const I18N_KEYS = {
    TITLE: 'account_recovery_request_pending_title',
    BODY: 'account_recovery_request_pending_body',
    CONFIRM: 'account_recovery_request_pending_confirm_button',
    CANCEL_REQUEST: 'account_recovery_request_pending_cancel_request_button',
    SEND_NEW_REQUEST: 'account_recovery_request_pending_send_new_request_button',
};
interface Props {
    onCancelOrSendNew: () => void;
    onDismiss: () => void;
    isVisible: boolean;
    action?: 'sendNewRequest' | 'cancel';
}
export const AccountRecoveryRequestPendingDialog: React.FunctionComponent<Props> = ({ onCancelOrSendNew, onDismiss, isVisible, action = 'cancel' }: Props) => {
    const { translate } = useTranslate();
    const cancelLabel = action === 'sendNewRequest'
        ? translate(I18N_KEYS.SEND_NEW_REQUEST)
        : translate(I18N_KEYS.CANCEL_REQUEST);
    return (<Dialog confirmLabel={translate(I18N_KEYS.CONFIRM)} onConfirm={onDismiss} cancelLabel={cancelLabel} onCancel={onCancelOrSendNew} visible={isVisible}>
      <div className={styles.icon}>
        <ClockOutlinedIcon size={62} color="ds.container.expressive.neutral.catchy.idle"/>
      </div>

      <header className={styles.dialogHeader}>
        {translate(I18N_KEYS.TITLE)}
      </header>
      <Paragraph sx={{ marginBottom: '16px' }} color="ds.text.brand.standard">
        {translate(I18N_KEYS.BODY)}
      </Paragraph>
    </Dialog>);
};
