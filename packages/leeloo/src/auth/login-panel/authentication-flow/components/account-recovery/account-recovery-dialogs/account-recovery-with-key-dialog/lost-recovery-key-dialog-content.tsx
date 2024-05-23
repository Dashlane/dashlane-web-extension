import React, { Fragment } from 'react';
import { Button, Heading, Paragraph } from '@dashlane/design-system';
import { DialogBody, DialogFooter, DialogTitle, jsx, } from '@dashlane/ui-components';
import { ACCOUNT_RESET_INFO_URL, HELPCENTER_FORGOT_MASTER_PASSWORD_URL, } from 'app/routes/constants';
import useTranslate from 'libs/i18n/useTranslate';
const I18N_KEYS = {
    RECOVERY_KEY_LOST_TITLE: 'webapp_login_form_lost_recovery_key_start_title',
    RECOVERY_KEY_LOST_DESCRIPTION_PRIMARY: 'webapp_login_form_lost_recovery_key_description_primary',
    RECOVERY_KEY_LOST_DESCRIPTION_SECONDARY: 'webapp_login_form_lost_recovery_key_description_secondary',
    BUTTON_LEARN_MORE: 'webapp_login_form_lost_recovery_key_learn_more_button',
    BUTTON_RESET_ACCOUNT: 'webapp_login_form_lost_recovery_key_reset_account_button',
};
export const LostRecoveryKeyDialogContent = () => {
    const { translate } = useTranslate();
    return (<>
      <DialogTitle>
        <Heading as="h2" color="ds.text.neutral.catchy" sx={{ margin: '32px 0 16px 0' }}>
          {translate(I18N_KEYS.RECOVERY_KEY_LOST_TITLE)}
        </Heading>
      </DialogTitle>
      <DialogBody>
        <Paragraph color="ds.text.neutral.standard" sx={{ marginBottom: '24px' }}>
          {translate(I18N_KEYS.RECOVERY_KEY_LOST_DESCRIPTION_PRIMARY)}
        </Paragraph>
        <Paragraph color="ds.text.neutral.standard">
          {translate(I18N_KEYS.RECOVERY_KEY_LOST_DESCRIPTION_SECONDARY)}
        </Paragraph>
      </DialogBody>
      <DialogFooter>
        <a href={HELPCENTER_FORGOT_MASTER_PASSWORD_URL} target="_blank" rel="noopener noreferrer">
          <Button intensity="quiet" mood="neutral" sx={{ marginRight: '8px' }}>
            {translate(I18N_KEYS.BUTTON_LEARN_MORE)}
          </Button>
        </a>
        <a href={ACCOUNT_RESET_INFO_URL} target="_blank" rel="noopener noreferrer">
          <Button>{translate(I18N_KEYS.BUTTON_RESET_ACCOUNT)}</Button>
        </a>
      </DialogFooter>
    </>);
};
