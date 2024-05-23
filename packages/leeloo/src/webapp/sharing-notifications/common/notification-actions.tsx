import { HTMLProps } from 'react';
import { Button } from '@dashlane/design-system';
import { CloseIcon, jsx } from '@dashlane/ui-components';
import useTranslate from 'libs/i18n/useTranslate';
import { NotificationStatus } from '../types';
import { ActionResult } from '../action-result';
const I18N_KEYS = {
    ACCEPT: 'webapp_sharing_notifications_accept',
    ACCEPT_SUCCEEDED: 'webapp_sharing_notifications_accept_succeeded',
    ACTION_FAILED: 'webapp_sharing_notifications_accept_failed',
    CANCEL: 'webapp_sharing_notifications_cancel',
    COMMON_DISMISS: '_common_alert_dismiss_button',
    REFUSE: 'webapp_sharing_notifications_refuse',
    SEE_DETAILS: 'webapp_sharing_notifications_see_details',
    SENDER_CANCELLED: 'webapp_sharing_notifications_sender_cancelled',
    SHARED_BY: 'webapp_sharing_notifications_shared_by',
};
interface NotificationActionsProps {
    notificationId: string;
    notificationStatus: NotificationStatus;
    onAcceptPending: (id: string) => void;
    onRefusePending: (id: string) => void;
    onRemoveUnshared: (id: string) => void;
    onConfirmRefusal: (id: string) => void;
    onCancelRefusal: (id: string) => void;
    onAccepted?: () => void;
    acceptedTranslationKey?: string;
}
const ButtonRow = (props: HTMLProps<HTMLDivElement>) => (<div sx={{ display: 'flex', gap: '8px', marginLeft: '8px' }} {...props}/>);
export const NotificationActions = ({ notificationId, notificationStatus, onAcceptPending, onRefusePending, onRemoveUnshared, onConfirmRefusal, onCancelRefusal, onAccepted, acceptedTranslationKey = I18N_KEYS.ACCEPT_SUCCEEDED, }: NotificationActionsProps) => {
    const { translate } = useTranslate();
    switch (notificationStatus) {
        case NotificationStatus.Accepted:
            return onAccepted ? (<Button intensity="quiet" mood="brand" size="small" onClick={() => {
                    onAccepted();
                }} data-close-dropdown={true}>
          {translate(I18N_KEYS.SEE_DETAILS)}
        </Button>) : null;
        case NotificationStatus.AcceptJustSucceeded:
            return (<ActionResult nature="success" text={translate(acceptedTranslationKey)}/>);
        case NotificationStatus.AcceptFailed:
        case NotificationStatus.RefusalFailed:
            return (<ActionResult nature="failure" text={translate(I18N_KEYS.ACTION_FAILED)}/>);
        case NotificationStatus.Unshared:
            return (<ActionResult nature="failure" text={translate(I18N_KEYS.SENDER_CANCELLED)}>
          <Button aria-label={translate(I18N_KEYS.COMMON_DISMISS)} icon={<CloseIcon />} intensity="supershy" layout="iconOnly" mood="neutral" size="small" onClick={() => onRemoveUnshared(notificationId)} sx={{ marginLeft: '8px' }}/>
        </ActionResult>);
        case NotificationStatus.AcceptInProgress:
            return (<ButtonRow>
          <Button intensity="supershy" mood="brand" size="small" disabled>
            {translate(I18N_KEYS.REFUSE)}
          </Button>
          <Button intensity="quiet" mood="brand" size="small" disabled>
            {translate(I18N_KEYS.ACCEPT)}
          </Button>
        </ButtonRow>);
        case NotificationStatus.ConfirmRefusal:
            return (<ButtonRow>
          <Button mood="danger" size="small" onClick={() => onConfirmRefusal(notificationId)}>
            {translate(I18N_KEYS.REFUSE)}
          </Button>
          <Button intensity="supershy" mood="brand" size="small" onClick={() => onCancelRefusal(notificationId)}>
            {translate(I18N_KEYS.CANCEL)}
          </Button>
        </ButtonRow>);
        case NotificationStatus.RefusalInProgress:
            return (<ButtonRow>
          <Button mood="danger" size="small" isLoading disabled>
            {translate(I18N_KEYS.REFUSE)}
          </Button>
          <Button intensity="supershy" mood="brand" size="small" disabled>
            {translate(I18N_KEYS.CANCEL)}
          </Button>
        </ButtonRow>);
        case NotificationStatus.Pending:
        default:
            return (<ButtonRow>
          <Button intensity="supershy" mood="brand" size="small" onClick={() => onRefusePending(notificationId)}>
            {translate(I18N_KEYS.REFUSE)}
          </Button>
          <Button intensity="quiet" mood="brand" size="small" onClick={() => onAcceptPending(notificationId)}>
            {translate(I18N_KEYS.ACCEPT)}
          </Button>
        </ButtonRow>);
    }
};
