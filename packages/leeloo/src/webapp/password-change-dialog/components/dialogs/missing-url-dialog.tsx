import { jsx } from '@dashlane/design-system';
import { ChangeEvent, FormEvent, useState } from 'react';
import { DialogFooter, InfoBox, Paragraph, TextInput, } from '@dashlane/ui-components';
import { CredentialDetailView } from '@dashlane/communication';
import useTranslate from 'libs/i18n/useTranslate';
import { SimpleDialog } from 'libs/dashlane-style/dialogs/simple/simple-dialog';
import { CredentialInfo, CredentialInfoSize, } from 'libs/dashlane-style/credential-info/credential-info';
import { DialogProps } from 'webapp/password-change-dialog/types';
import styles from './missing-url-dialog.css';
type MissingURLDialogProps = DialogProps & {
    credential: CredentialDetailView;
    onSuccess: (update: {
        url: string;
    }) => Promise<void>;
};
const validator = require('validator');
const I18N_KEYS = {
    TITLE: 'webapp_change_password_dialog_no_website_title',
    SUBTITLE: 'webapp_change_password_dialog_no_website_description',
    LABEL: 'webapp_change_password_dialog_no_website_add_website_input_name',
    PLACEHOLDER: 'webapp_change_password_dialog_no_website_add_website_input_placeholder',
    FORMAT_ERROR: 'webapp_change_password_dialog_no_website_add_website_input_format_error',
    CANCEL: 'webapp_change_password_dialog_no_website_add_website_cancel_button_label',
    SUBMIT: 'webapp_change_password_dialog_no_website_add_website_submit_button_label',
    SUBMIT_CONFIRM: 'webapp_change_password_dialog_no_website_add_website_submit_confirm_button_label',
};
const FORM_ID = 'missing-url-form';
export const MissingURLDialog = ({ credential, onDismiss, onSuccess, }: MissingURLDialogProps) => {
    const { translate } = useTranslate();
    const [error, setError] = useState(false);
    const [value, setValue] = useState('');
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const valid = validator.isFQDN(value) || validator.isURL(value);
        if (!valid && !error) {
            setError(true);
            return;
        }
        onSuccess({ url: value });
    };
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target;
        setValue(input.value);
    };
    const { title, login, email, autoProtected, sharingStatus: { isShared: shared }, } = credential;
    return (<SimpleDialog isOpen onRequestClose={onDismiss} disableBackgroundPanelClose footer={<DialogFooter primaryButtonTitle={error
                ? translate(I18N_KEYS.SUBMIT_CONFIRM)
                : translate(I18N_KEYS.SUBMIT)} primaryButtonProps={{
                disabled: !value,
                form: FORM_ID,
                type: 'submit',
            }} secondaryButtonTitle={translate(I18N_KEYS.CANCEL)} secondaryButtonOnClick={onDismiss} intent="primary"/>} title={translate(I18N_KEYS.TITLE)}>
      <Paragraph className={styles.subtitle}>
        {translate(I18N_KEYS.SUBTITLE)}
      </Paragraph>
      <div className={styles.container}>
        {title && (<CredentialInfo title={title} login={login} email={email} shared={shared} autoProtected={autoProtected} size={CredentialInfoSize.SMALL} sxProps={{
                marginBottom: '30px',
            }}/>)}
        <form id={FORM_ID} role="form" autoComplete="off" noValidate={true} onSubmit={handleSubmit}>
          <TextInput label={translate(I18N_KEYS.LABEL)} fullWidth autoFocus id="missingWebsite" value={value} onChange={handleChange} placeholder={translate(I18N_KEYS.PLACEHOLDER)} aria-describedby={error ? 'missingWebsiteFormatError' : undefined}/>
        </form>
        {error ? (<InfoBox size="small" severity="warning" className={styles.alert} title={<p role="alert" id="missingWebsiteFormatError">
                {translate('webapp_change_password_dialog_no_website_add_website_input_format_error')}
              </p>}/>) : null}
      </div>
    </SimpleDialog>);
};
