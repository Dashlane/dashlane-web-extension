import { BiometricOutlinedIcon } from '@dashlane/ui-components';
import { Dialog, Heading, Infobox, jsx, Paragraph, } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import styles from './webauthn-dialog.css';
import { allIgnoreClickOutsideClassName } from 'webapp/variables';
const I18N_KEYS = {
    ALL_AUTHENTICATORS_TITLE: 'webapp_account_security_settings_passwordless_enable_all_authenticators_title',
    ALL_AUTHENTICATORS_DESC: 'webapp_account_security_settings_passwordless_enable_all_authenticators_description',
    ALL_AUTHENTICATORS_BUTTON_ADD: 'webapp_account_security_settings_passwordless_enable_all_authenticators_button_add',
    NO_PLATFORM_TITLE: 'webapp_account_security_settings_passwordless_enable_noplatform_title',
    NO_PLATFORM_DESC: 'webapp_account_security_settings_passwordless_enable_noplatform_description',
    NO_PLATFORM_BUTTON_ADD: 'webapp_account_security_settings_passwordless_enable_noplaftorm_button_add',
    INFOBOX: 'webapp_account_security_settings_passwordless_enable_all_authenticators_information_tip',
    BUTTON_CANCEL: 'webapp_account_security_settings_passwordless_enable_button_cancel',
    BUTTON_CLOSE_DIALOG: '_common_dialog_dismiss_button',
};
interface EnableWebAuthnDialogProps {
    userHasWebAuthnPlatformAuthenticator: boolean | null;
    onAddAuthenticator: () => void;
    onDismiss: () => void;
}
export const EnableWebAuthnDialog = ({ userHasWebAuthnPlatformAuthenticator, onAddAuthenticator, onDismiss, }: EnableWebAuthnDialogProps) => {
    const { translate } = useTranslate();
    const title = userHasWebAuthnPlatformAuthenticator
        ? I18N_KEYS.ALL_AUTHENTICATORS_TITLE
        : I18N_KEYS.NO_PLATFORM_TITLE;
    const description = userHasWebAuthnPlatformAuthenticator
        ? I18N_KEYS.ALL_AUTHENTICATORS_DESC
        : I18N_KEYS.NO_PLATFORM_DESC;
    const addButton = userHasWebAuthnPlatformAuthenticator
        ? I18N_KEYS.ALL_AUTHENTICATORS_BUTTON_ADD
        : I18N_KEYS.NO_PLATFORM_BUTTON_ADD;
    return (<Dialog title={''} isOpen onClose={onDismiss} actions={{
            primary: {
                children: translate(addButton),
                onClick: onAddAuthenticator,
            },
            secondary: {
                children: translate(I18N_KEYS.BUTTON_CANCEL),
                onClick: onDismiss,
            },
        }} closeActionLabel={translate(I18N_KEYS.BUTTON_CLOSE_DIALOG)} dialogClassName={allIgnoreClickOutsideClassName} aria-describedby="enableDialogBody">
      <div className={styles.icon}>
        <BiometricOutlinedIcon size={60} aria-hidden="true"/>
      </div>

      <Heading as="h2">{translate(title)}</Heading>
      <Paragraph id="enableDialogBody" color="ds.text.neutral.quiet" sx={{ marginBottom: '18px' }}>
        {translate(description)}
      </Paragraph>
      <Infobox title={translate(I18N_KEYS.INFOBOX)}/>
    </Dialog>);
};
