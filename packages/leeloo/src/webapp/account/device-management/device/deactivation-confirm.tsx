import * as React from 'react';
import useTranslate from 'libs/i18n/useTranslate';
import DangerButton from 'libs/dashlane-style/buttons/modern/danger';
import ButtonSecondary from 'libs/dashlane-style/buttons/modern/secondary';
import styles from './styles.css';
const I18N_KEYS = {
    CANCEL_DEACTIVATE_BUTTON: 'webapp_account_devices_device_cancel_deactivate_button',
    CONFIRM_DEACTIVATE_BUTTON: 'webapp_account_devices_device_confirm_deactivate_button',
};
interface ConfirmProps {
    onConfirm: () => void;
    onCancel: () => void;
}
export const DeactivationConfirm = ({ onConfirm, onCancel }: ConfirmProps) => {
    const { translate } = useTranslate();
    return (<div className={styles.deactivateConfirmationCTAs}>
      <ButtonSecondary size="small" marginSide="right" onClick={onCancel} label={translate(I18N_KEYS.CANCEL_DEACTIVATE_BUTTON)}/>
      <DangerButton size="small" onClick={onConfirm} label={translate(I18N_KEYS.CONFIRM_DEACTIVATE_BUTTON)}/>
    </div>);
};
