import { Fragment, useCallback, useState } from 'react';
import { DataLeaksEmail } from '@dashlane/password-security-contracts';
import { isSuccess } from '@dashlane/framework-types';
import { Button, Heading, Icon, jsx, Paragraph, ThemeUIStyleObject, } from '@dashlane/design-system';
import { AlertSeverity, Card, FlexContainer, UseAlert, } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { MonitoredEmail } from './email/monitored-email';
import { PlaceholderEmail } from './email/placeholder-email';
import { RemoveEmailDialog } from './remove-email-dialog/remove-email-dialog';
import { useDarkWebMonitoringEmails } from 'webapp/dark-web-monitoring/hooks/useDarkWebMonitoringEmails';
const I18N_KEYS = {
    MONITORED_EMAILS: 'webapp_darkweb_email_monitored_emails_title',
    MONITORED_TOOLTIP: 'webapp_darkweb_email_monitored_emails_tooltip',
    MONITORED_TOOLTIP_ONE: 'webapp_darkweb_email_monitored_emails_tooltip_one',
    MONITORED_TOOLTIP_ZERO: 'webapp_darkweb_email_monitored_emails_tooltip_zero',
    ADD_EMAIL: 'webapp_darkweb_email_add_action',
    AVAILABLE_SPOTS: 'webapp_darkweb_email_available_spots_count_markup',
    GO_PREMIUM_TOOLTIP: 'webapp_darkweb_email_monitored_emails_add_email_go_premium_tooltip',
    NO_AVAILABLE_SPOTS: 'webapp_darkweb_email_no_available_spots',
    REMOVE_EMAIL_ERROR: 'webapp_darkweb_email_stop_monitoring_dialog_error',
    REMOVE_EMAIL_SUCCESS: 'webapp_darkweb_email_stop_monitoring_dialog_email_success_alert',
};
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
    emailsCard: {
        borderRadius: '4px',
        display: ' flex',
        flexDirection: 'column',
        marginBottom: '16px',
        padding: '32px',
        minWidth: '480px',
        maxWidth: '640px',
        backgroundColor: 'ds.container.agnostic.neutral.supershy',
        border: '1px solid ds.border.neutral.quiet.idle',
    },
    subtitle: {
        alignSelf: 'flexStart',
        display: 'flex',
        marginBottom: '24px',
    },
    emailFooter: {
        marginTop: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
};
export interface Props {
    emails: DataLeaksEmail[] | null;
    b2bAssociatedEmail: string | null;
    availableEmailSpots: number;
    removalOutcomeAlert: UseAlert;
    onOpenAddDialog: () => void;
    newlyAddedEmail: string | null;
    setNewlyAddedEmail: (email: string | null) => void;
    hasDataLeakCapability: boolean;
}
const isAddButtonDisabled = (availableSpots: number, hasDataLeakCapability: boolean): boolean => {
    return hasDataLeakCapability ? availableSpots <= 0 : true;
};
export const MonitoredEmails = ({ emails, b2bAssociatedEmail, availableEmailSpots, onOpenAddDialog, removalOutcomeAlert, setNewlyAddedEmail, newlyAddedEmail, hasDataLeakCapability, }: Props) => {
    const { translate } = useTranslate();
    const { optoutEmail } = useDarkWebMonitoringEmails();
    const [emailToRemove, setEmailToRemove] = useState<string | null>(null);
    const openRemoveDialog = (email: string) => {
        setEmailToRemove(email);
    };
    const handleOnClosePendingNotification = useCallback(() => {
        setNewlyAddedEmail(null);
    }, [setNewlyAddedEmail]);
    const closeRemoveDialog = useCallback(() => {
        setEmailToRemove(null);
    }, [setEmailToRemove]);
    const handleRemovalSuccess = useCallback((email: string) => {
        removalOutcomeAlert.setMessage(translate(I18N_KEYS.REMOVE_EMAIL_SUCCESS, { email }));
        removalOutcomeAlert.setSeverity(AlertSeverity.SUCCESS);
        removalOutcomeAlert.show();
    }, [translate, removalOutcomeAlert]);
    const handleRemovalError = useCallback(() => {
        removalOutcomeAlert.setMessage(translate(I18N_KEYS.REMOVE_EMAIL_ERROR));
        removalOutcomeAlert.setSeverity(AlertSeverity.ERROR);
        removalOutcomeAlert.show();
    }, [translate, removalOutcomeAlert]);
    const onRemoveEmail = async (email: string) => {
        const result = await optoutEmail(email);
        closeRemoveDialog();
        if (isSuccess(result)) {
            handleRemovalSuccess(email);
        }
        else {
            handleRemovalError();
        }
    };
    const onCancelRemoveEmail = () => {
        closeRemoveDialog();
    };
    const getMonitoredTooltipTitleKey = () => {
        switch (emails?.length) {
            case 0:
                return I18N_KEYS.MONITORED_TOOLTIP_ZERO;
            case 1:
                return I18N_KEYS.MONITORED_TOOLTIP_ONE;
            default:
                return I18N_KEYS.MONITORED_TOOLTIP;
        }
    };
    return (<>
      <Card sx={SX_STYLES.emailsCard}>
        <FlexContainer sx={SX_STYLES.subtitle}>
          <Heading as="h2" textStyle="ds.title.supporting.small" color="ds.text.neutral.quiet">
            {translate(I18N_KEYS.MONITORED_EMAILS)}
          </Heading>
          <Icon name="FeedbackInfoOutlined" size="xsmall" color="ds.text.neutral.quiet" tooltip={translate(getMonitoredTooltipTitleKey())} sx={{ marginLeft: '6px' }}/>
        </FlexContainer>
        <ul sx={{ justifyContent: 'center' }}>
          {emails
            ? emails.map(({ email, state }) => (<MonitoredEmail key={email} email={email} state={state} canEmailBeRemoved={email !== b2bAssociatedEmail} handleOnRemoveClick={openRemoveDialog} handleOnClosePendingNotification={handleOnClosePendingNotification} showPendingNotification={email === newlyAddedEmail} showPendingTooltip={email !== newlyAddedEmail}/>))
            : null}
          {[...Array(availableEmailSpots)].map((val, index) => (<PlaceholderEmail key={index}/>))}
        </ul>

        <FlexContainer sx={SX_STYLES.emailFooter}>
          <Paragraph textStyle="ds.body.standard.regular" color="ds.text.neutral.standard">
            {availableEmailSpots > 0
            ? translate.markup(I18N_KEYS.AVAILABLE_SPOTS, {
                count: availableEmailSpots,
            })
            : translate(I18N_KEYS.NO_AVAILABLE_SPOTS)}
          </Paragraph>
          <Button size="small" mood="neutral" intensity="quiet" layout="iconTrailing" color="ds.container.expressive.neutral.quiet.idle" icon="ActionAddOutlined" disabled={isAddButtonDisabled(availableEmailSpots, hasDataLeakCapability)} onClick={onOpenAddDialog}>
            {translate(I18N_KEYS.ADD_EMAIL)}
          </Button>
        </FlexContainer>
      </Card>

      {emailToRemove ? (<RemoveEmailDialog email={emailToRemove} handleOnCloseDialog={onCancelRemoveEmail} handleOnRemoveEmail={onRemoveEmail}/>) : null}
    </>);
};
