import React from 'react';
import classNames from 'classnames';
import { CloudKeyCheckedIcon, Dialog, DialogBody, DialogFooter, DialogTitle, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import styles from './sso-activated-dialog.css';
const I18N_KEYS = {
    SSO_ACTIVATED_TITLE: 'sso_activated_popup_title',
    SSO_ACTIVATED_TEXT_1: 'sso_activated_popup_text_1',
    SSO_ACTIVATED_TEXT_2: 'sso_activated_popup_text_2',
    SSO_ACTIVATED_PRIMARY_BUTTON: 'sso_activated_popup_primary_button',
    CLOSE: '_common_dialog_dismiss_button',
};
export const SSOActivatedDialog = () => {
    const { translate } = useTranslate();
    const [isOpen, setIsOpen] = React.useState(true);
    return (<Dialog closeIconName={translate(I18N_KEYS.CLOSE)} isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <div className={styles.dialogContainer}>
        <DialogTitle>
          <CloudKeyCheckedIcon size={90}/>
          <h2 className={styles.SSOActivatedTitle}>
            {translate(I18N_KEYS.SSO_ACTIVATED_TITLE)}
          </h2>
        </DialogTitle>
        <DialogBody>
          <p className={styles.SSOActivatedText}>
            {translate(I18N_KEYS.SSO_ACTIVATED_TEXT_1)}
          </p>
          <p className={classNames(styles.SSOActivatedText, styles.SSOActivatedSecondaryText)}>
            {translate(I18N_KEYS.SSO_ACTIVATED_TEXT_2)}
          </p>
        </DialogBody>
        <DialogFooter primaryButtonOnClick={() => setIsOpen(false)} primaryButtonTitle={translate(I18N_KEYS.SSO_ACTIVATED_PRIMARY_BUTTON)}/>
      </div>
    </Dialog>);
};
