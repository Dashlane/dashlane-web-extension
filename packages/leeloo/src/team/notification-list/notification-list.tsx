import { useCallback, useContext, useEffect, useState } from 'react';
import { jsx } from '@dashlane/design-system';
import { useFeatureFlip } from '@dashlane/framework-react';
import { Lee } from 'lee';
import { getAuth } from 'user';
import TeamPlans from 'libs/api/TeamPlans';
import { Team } from 'libs/api/types';
import useTranslate from 'libs/i18n/useTranslate';
import { isMarkupTextKey } from 'libs/i18n/helpers';
import { Notification } from 'libs/notifications/types';
import { ShowVaultNavModalContext } from 'team/show-vault-nav-modal/show-vault-nav-modal-provider';
import { updateNotifications } from 'team/members/notifications/update-notifications';
import { getDirectorySyncNotifications } from 'team/directory-sync-key/notifications';
import { getIeDropNotifications } from 'team/ie-drop-notification';
import { SingleNotification } from './single-notification/single-notification';
import styles from './styles.css';
const TAC_GET_STARTED_FEATURE_FLIP = 'onboarding_web_tacgetstarted';
interface NotificationListProps {
    lee: Lee;
}
export const NotificationList = ({ lee }: NotificationListProps) => {
    const { translate } = useTranslate();
    const isTacGetStartedFFEnabled = useFeatureFlip(TAC_GET_STARTED_FEATURE_FLIP) ?? true;
    const { setIsVaultNavigationModalOpen } = useContext(ShowVaultNavModalContext);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const tryUpdateNotifications = useCallback((teamStatus?: Team) => {
        if (!teamStatus) {
            return;
        }
        updateNotifications({
            lee: lee,
            teamStatus,
            showTacInExtension: !APP_PACKAGED_IN_EXTENSION,
            translate,
            setIsVaultNavigationModalOpen,
            isTacGetStartedFFEnabled,
        });
    }, []);
    const getNotifications = (): Notification[] => {
        const baseNotifs = lee.globalState.notifications.list;
        const directorySyncKeyNotifs = getDirectorySyncNotifications(lee);
        const ieNotifications = getIeDropNotifications(lee);
        return [...baseNotifs, ...directorySyncKeyNotifs, ...ieNotifications];
    };
    useEffect(() => {
        setNotifications(getNotifications());
    }, [
        lee.globalState.ieNotifications,
        lee.globalState.directorySyncKey,
        lee.globalState.notifications.list,
    ]);
    useEffect(() => {
        const auth = getAuth(lee.globalState);
        if (!auth) {
            return;
        }
        new TeamPlans()
            .status({ auth })
            .then((result) => {
            if (result.code !== 200) {
                return;
            }
            const { content: { team }, } = result;
            tryUpdateNotifications(team);
        })
            .catch();
    }, [lee.globalState.user.session.uki]);
    return (<div className={styles.notifications}>
      {notifications.map((notification) => (<SingleNotification key={notification.key} level={notification.level} text={isMarkupTextKey(notification.textKey)
                ? translate.markup(notification.textKey, notification.keyParams)
                : translate(notification.textKey)} buttonTextKey={notification.buttonTextKey
                ? translate(notification.buttonTextKey)
                : undefined} onClose={notification.handleClose} onLinkClick={notification.handleLinkClick} onClickButton={notification.handleButtonClick}/>))}
    </div>);
};
