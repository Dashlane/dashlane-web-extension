import classNames from 'classnames';
import { colors, Dialog, DialogBody, DialogTitle, jsx, Paragraph, } from '@dashlane/ui-components';
import { CreatePasswordForm } from 'webapp/create-password-form/create-password-form';
import useTranslate from 'libs/i18n/useTranslate';
import { allIgnoreClickOutsideClassName } from 'webapp/variables';
export interface Props {
    isOpen: boolean;
    onDismiss: () => void;
    onConfirm: (password: string) => void;
}
export const I18N_KEYS = {
    TITLE: 'webapp_create_unique_password_title',
    SUBTITLE: 'webapp_create_unique_password_subtitle',
    CANCEL: 'webapp_create_unique_password_cancel',
    ENTER_PASSWORD_INPUT: 'webapp_create_unique_password_enter_password_input',
    CREATE_PASSWORD_PLACEHOLDER_LABEL: 'webapp_create_unique_password_create_password_placeholder',
    CONFIRM_PASSWORD_INPUT: 'webapp_create_unique_password_confirm_password_input',
    EXPORT_DATA_BUTTON: 'webapp_create_unique_password_export_data_button',
    CLOSE: '_common_dialog_dismiss_button',
};
export const CreateUniquePasswordDialog = ({ onDismiss, onConfirm, isOpen, }: Props) => {
    const { translate } = useTranslate();
    const contentClassName = classNames([allIgnoreClickOutsideClassName]);
    return (<Dialog closeIconName={translate(I18N_KEYS.CLOSE)} isOpen={isOpen} onClose={onDismiss} disableOutsideClickClose={true} modalContentClassName={contentClassName} disableUserInputTrap>
      <DialogTitle title={translate(I18N_KEYS.TITLE)}/>
      <DialogBody>
        <Paragraph color={colors.dashGreen01}>
          {translate(I18N_KEYS.SUBTITLE)}
        </Paragraph>
      </DialogBody>
      <CreatePasswordForm createPasswordInputLabel={translate(I18N_KEYS.ENTER_PASSWORD_INPUT)} createPasswordPlaceholderLabel={translate(I18N_KEYS.CREATE_PASSWORD_PLACEHOLDER_LABEL)} confirmPasswordInputLabel={translate(I18N_KEYS.CONFIRM_PASSWORD_INPUT)} confirmPasswordPlaceholderLabel={translate(I18N_KEYS.CONFIRM_PASSWORD_INPUT)} primaryButtonTitle={translate(I18N_KEYS.EXPORT_DATA_BUTTON)} secondaryButtonTitle={translate(I18N_KEYS.CANCEL)} onSubmit={onConfirm} onDismiss={onDismiss}/>
    </Dialog>);
};
