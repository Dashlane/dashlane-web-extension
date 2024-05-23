import { jsx } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { SharedItemNotification } from '../types';
import { NotificationRow } from '../common/notification-row';
import { ItemLogo } from './item-logo';
import { PendingItemActions } from './pending-item-actions';
const I18N_KEYS = {
    ACCEPT: 'webapp_sharing_notifications_accept',
    CANCEL: 'webapp_sharing_notifications_cancel',
    CONFIRM_REFUSE_TEXT: 'webapp_sharing_notifications_confirm_refuse_text',
    SHARED_BY: 'webapp_sharing_notifications_shared_by',
    REFUSE: 'webapp_sharing_notifications_refuse',
};
interface PendingItemProps {
    notification: SharedItemNotification;
    acceptPendingItemGroup: (itemGroupId: string) => void;
    cancelRefusePendingItemGroup: (itemGroupId: string) => void;
    confirmRefusePendingItemGroup: (itemGroupId: string) => void;
    refusePendingItemGroup: (itemGroupId: string) => void;
    removeUnsharedItem: (itemGroupId: string) => void;
    routes: {
        userCredential: (id: string) => string;
        userSecureNote: (id: string) => string;
        userSecret: (id: string) => string;
    };
}
export const PendingItemRow = (props: PendingItemProps) => {
    const { notification } = props;
    const { translate } = useTranslate();
    const { referrer } = notification.itemGroup;
    const itemContent = notification.itemGroup.items[0];
    const { Title } = itemContent;
    const sharedBy = translate(I18N_KEYS.SHARED_BY, { referrer });
    return (<NotificationRow name={Title} sharedBy={sharedBy} icon={<ItemLogo item={itemContent}/>} actions={<PendingItemActions {...props}/>} notification={notification}/>);
};
