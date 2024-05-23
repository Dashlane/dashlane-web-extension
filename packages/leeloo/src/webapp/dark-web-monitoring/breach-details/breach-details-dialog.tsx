import { Dialog, DialogBody, DialogFooter, DialogTitle, Eyebrow, jsx, } from '@dashlane/ui-components';
import { BreachLeakedDataType } from '@dashlane/communication';
import { CredentialInfoSize } from 'libs/dashlane-style/credential-info/credential-info';
import { CredentialThumbnail } from 'libs/dashlane-style/credential-info/credential-thumbnail';
import useTranslate from 'libs/i18n/useTranslate';
import { getBreachDate } from 'webapp/dark-web-monitoring/helpers/date';
import { ContentPasswordSection } from 'webapp/dark-web-monitoring/breach-details/content/breach-details-password-content';
import { ContentOtherSection } from 'webapp/dark-web-monitoring/breach-details/content/breach-details-other-content';
import { useBreachDetails } from '../hooks/useBreachDetails';
import { PasswordChangeDialog } from '../../password-change-dialog/components/dialogs/password-change-dialog';
import styles from './styles.css';
import { Fragment, useCallback, useState } from 'react';
const I18N_KEYS = {
    ACTION_CHANGE_PASSWORD: 'webapp_darkweb_alert_action_change_password',
    ACTION_DISMISS: 'webapp_darkweb_alert_action_dismiss',
    ACTION_CLOSE: 'webapp_darkweb_alert_action_close',
    DESCRIPTION: 'webapp_darkweb_alert_description',
    HEADER_UNKNOWN_WEBSITE: 'webapp_darkweb_alert_header_unknown_website',
    LABEL_DATE: 'webapp_darkweb_alert_label_date',
    LABEL_EMAIL: 'webapp_darkweb_alert_label_email2',
    CLOSE: '_common_dialog_dismiss_button',
};
export interface BreachDetailsDialogProps {
    breachId: string;
    onDismissClick: () => void;
}
const DEFAULT_THUMBNAIL_TEXT = '?';
export const BreachDetailsDialog = ({ breachId, onDismissClick, }: BreachDetailsDialogProps) => {
    const { translate } = useTranslate();
    const { breach, compromisedCredentialsIds } = useBreachDetails(breachId);
    const [passwordChangeCredentialId, setPasswordChangeCredentialId] = useState<null | string>(null);
    const openPasswordChange = useCallback((credentialId) => setPasswordChangeCredentialId(credentialId), []);
    const closePasswordChange = useCallback(() => {
        setPasswordChangeCredentialId(null);
        onDismissClick();
    }, [onDismissClick]);
    if (!breach) {
        return null;
    }
    const { eventDate, leakedData, domains, impactedEmails, leakedPasswords } = breach;
    const [firstDomain] = domains;
    const isPasswordLeaked = leakedData.includes(BreachLeakedDataType.Password);
    const isCreditCardLeaked = leakedData.includes(BreachLeakedDataType.CreditCard);
    const { date } = getBreachDate(eventDate, 'long', translate);
    return (<>
      {passwordChangeCredentialId ? (<PasswordChangeDialog credentialId={passwordChangeCredentialId} dismissCallback={closePasswordChange}/>) : null}
      <Dialog closeIconName={translate(I18N_KEYS.CLOSE)} isOpen onClose={onDismissClick} disableOutsideClickClose={!!passwordChangeCredentialId}>
        <DialogTitle>
          <div className={styles.dialogHeader}>
            <div className={styles.icon}>
              <CredentialThumbnail domain={firstDomain} title={firstDomain ?? DEFAULT_THUMBNAIL_TEXT} size={CredentialInfoSize.SMALL}/>
            </div>
            <div className={styles.title}>
              {firstDomain ?? translate(I18N_KEYS.HEADER_UNKNOWN_WEBSITE)}
            </div>
          </div>
        </DialogTitle>

        <DialogBody>
          <section className={styles.dialogSubtitle}>
            {translate(I18N_KEYS.DESCRIPTION)}
          </section>
          <section className={styles.section}>
            <Eyebrow as="header" size="small" color="primaries.5" sx={{ marginBottom: '4px' }}>
              {translate(I18N_KEYS.LABEL_DATE)}
            </Eyebrow>
            <div className={styles.content}>{date}</div>
          </section>
          <section className={styles.section}>
            <Eyebrow as="header" size="small" color="primaries.5" sx={{ marginBottom: '4px' }}>
              {translate(I18N_KEYS.LABEL_EMAIL, {
            count: impactedEmails.length,
        })}
            </Eyebrow>
            <div className={styles.content}>
              <ul>
                {impactedEmails.map((email) => (<li key={email}>{email}</li>))}
              </ul>
            </div>
          </section>

          {leakedPasswords.length === 0 ? (<ContentOtherSection isPasswordLeaked={isPasswordLeaked} isCreditCardLeaked={isCreditCardLeaked} leakedData={leakedData} domain={firstDomain}/>) : (<ContentPasswordSection passwords={leakedPasswords} leakedData={leakedData} domain={firstDomain}/>)}
        </DialogBody>
        {compromisedCredentialsIds.length === 1 ? (<DialogFooter primaryButtonTitle={translate(I18N_KEYS.ACTION_DISMISS)} primaryButtonOnClick={onDismissClick} secondaryButtonTitle={translate(I18N_KEYS.ACTION_CHANGE_PASSWORD)} secondaryButtonOnClick={() => {
                openPasswordChange(compromisedCredentialsIds[0]);
            }}/>) : (<DialogFooter primaryButtonTitle={translate(I18N_KEYS.ACTION_CLOSE)} primaryButtonOnClick={onDismissClick}/>)}
      </Dialog>
    </>);
};
