import { jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { isNotificationDisabled, SharedCollectionNotification } from '../types';
import { NotificationRow } from '../common/notification-row';
import { CollectionLogo } from './collection-logo';
import { PendingCollectionActions } from './pending-collection-actions';
const I18N_KEYS = {
    CANCEL: 'webapp_sharing_notifications_cancel',
    CONFIRM_REFUSE_TEXT: 'webapp_sharing_notifications_confirm_refuse_text',
    INVITED_BY: 'webapp_sharing_notifications_invited_by',
    REFUSE: 'webapp_sharing_notifications_refuse',
};
interface PendingCollectionRowProps {
    notification: SharedCollectionNotification;
    acceptPendingCollection: (userGroupId: string) => void;
    refusePendingCollection: (userGroupId: string) => void;
    removeUnsharedCollection: (userGroupId: string) => void;
    cancelRefusePendingCollection: (userGroupId: string) => void;
    confirmRefusePendingCollection: (userGroupId: string) => void;
    routes: {
        userCollection: (id: string) => string;
    };
}
export const PendingCollectionRow = (props: PendingCollectionRowProps) => {
    const { notification } = props;
    const { translate } = useTranslate();
    const { collection } = notification;
    const { name, referrer } = collection;
    const disabled = isNotificationDisabled(notification);
    const referrerLabel = translate(I18N_KEYS.INVITED_BY, { referrer });
    return (<NotificationRow name={name} sharedBy={referrerLabel} icon={<CollectionLogo disabled={disabled}/>} actions={<PendingCollectionActions {...props}/>} notification={notification}/>);
};
