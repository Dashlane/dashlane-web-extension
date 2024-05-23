import type { ChangeEventHandler, KeyboardEvent, PropsWithChildren, } from 'react';
import { Dialog, DialogBody, DialogFooter, DialogTitle, Heading, jsx, PasswordInput, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import styles from './styles.css';
interface Props {
    onChange: ChangeEventHandler<HTMLInputElement>;
    defaultValue?: string;
    isMasterPasswordInvalid: boolean;
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
    onDismiss: () => void;
    onConfirm?: () => void;
    labelDismiss?: string;
    labelConfirm?: string;
    title?: string;
    ctaIsDisabled?: boolean;
    isOpen: boolean;
}
const I18N = {
    CONFIRMATION_ERROR: 'team_settings_confirmation_dialog_error_message',
    PASSWORD_SHOW: 'team_settings_confirmation_dialog_password_field_show_label',
    PASSWORD_HIDE: 'team_settings_confirmation_dialog_password_field_hide_label',
    PASSWORD_HINT: 'team_settings_confirmation_dialog_password_field_hint_text',
    MP_INPUT_LABEL: 'webapp_lock_items_security_settings_title',
    CLOSE: '_common_dialog_dismiss_button',
};
const ConfirmationDialog = ({ onChange, defaultValue, isMasterPasswordInvalid, onKeyDown, onDismiss, onConfirm, labelDismiss, labelConfirm, title, ctaIsDisabled, isOpen, children, }: PropsWithChildren<Props>) => {
    const { translate } = useTranslate();
    return (<Dialog closeIconName={translate(I18N.CLOSE)} isOpen={isOpen} onClose={onDismiss} disableUserInputTrap>
      <DialogTitle>
        <Heading size="small" sx={{ marginBottom: '16px' }}>
          {title}
        </Heading>
      </DialogTitle>
      <DialogBody>
        <div className={styles.textWrapper}>{children}</div>

        <PasswordInput defaultValue={defaultValue} onChange={onChange} feedbackText={isMasterPasswordInvalid ? translate(I18N.CONFIRMATION_ERROR) : ''} label={translate(I18N.MP_INPUT_LABEL)} feedbackType={isMasterPasswordInvalid ? 'error' : undefined} hidePasswordTooltipText={translate(I18N.PASSWORD_HIDE)} showPasswordTooltipText={translate(I18N.PASSWORD_SHOW)} onKeyDown={onKeyDown} placeholder={translate(I18N.PASSWORD_HINT)}/>
      </DialogBody>
      <DialogFooter primaryButtonTitle={labelConfirm} primaryButtonOnClick={onConfirm} primaryButtonProps={{
            disabled: ctaIsDisabled,
        }} secondaryButtonTitle={labelDismiss} secondaryButtonOnClick={onDismiss} intent="primary"/>
    </Dialog>);
};
export default ConfirmationDialog;
