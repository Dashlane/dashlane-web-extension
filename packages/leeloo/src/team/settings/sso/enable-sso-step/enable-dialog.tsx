import React from 'react';
import { Dialog, DialogBody, DialogFooter, DialogTitle, InfoBox, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { DialogAction } from 'team/settings/sso/types';
import { DESKTOP_APP_NOT_SUPPORTED } from 'team/urls';
import styles from './styles.css';
export interface DialogProps {
    closeDialog: Function;
}
const I18N_KEYS = {
    DIALOG_TITLE: 'team_settings_enable_sso_dialog_activate_title',
    DIALOG_DESCRIPTION: 'team_settings_enable_sso_dialog_activate_description_markup',
    DIALOG_ACTION: 'team_settings_enable_sso_dialog_activate_action',
    DIALOG_CANCEL: 'team_settings_enable_sso_cancel',
    INFOBOX_BUSINESS_TIER_WARNING: 'team_settings_sso_desktop_infobox_warning_markup',
    CLOSE: '_common_dialog_dismiss_button',
};
export const EnableSsoDialog = ({ closeDialog }: DialogProps) => {
    const { translate } = useTranslate();
    const infoboxText = translate.markup(I18N_KEYS.INFOBOX_BUSINESS_TIER_WARNING, {
        learnMore: DESKTOP_APP_NOT_SUPPORTED,
    }, { linkTarget: '_blank' });
    return (<Dialog closeIconName={translate(I18N_KEYS.CLOSE)} isOpen onClose={() => closeDialog(DialogAction.dismiss)}>
      <div className={styles.container}>
        <DialogTitle title={translate(I18N_KEYS.DIALOG_TITLE)}/>
        <DialogBody>
          <div className={styles.toggleInfoBox}>
            {infoboxText && (<InfoBox severity="warning" size="small" title={infoboxText}/>)}
          </div>
        </DialogBody>
        <DialogFooter primaryButtonOnClick={() => closeDialog(DialogAction.action)} primaryButtonTitle={translate(I18N_KEYS.DIALOG_ACTION)} secondaryButtonOnClick={() => closeDialog(DialogAction.dismiss)} secondaryButtonTitle={translate(I18N_KEYS.DIALOG_CANCEL)}/>
      </div>
    </Dialog>);
};
