import { AlertSeverity } from '@dashlane/ui-components';
import { Notification } from 'libs/notifications/types';
import { Lee } from 'lee';
import { closeNotificationAction, reopenDialogAction } from './reducer';
export function getDirectorySyncNotifications(lee: Lee): Notification[] {
    const isFullAdmin = lee.permission.adminAccess.hasFullAccess;
    const state = lee.globalState.directorySyncKey;
    if (!isFullAdmin || !state.validationPostponed) {
        return [];
    }
    const handleLinkClick = (event: MouseEvent) => {
        event.preventDefault();
        lee.dispatchGlobal(reopenDialogAction());
    };
    const handleClose = () => lee.dispatchGlobal(closeNotificationAction());
    return [
        {
            key: 'directorySyncPosponedValidation',
            level: AlertSeverity.WARNING,
            textKey: 'team_directory_sync_key_postponed_notif_markup',
            handleLinkClick,
            handleClose,
        },
    ];
}
