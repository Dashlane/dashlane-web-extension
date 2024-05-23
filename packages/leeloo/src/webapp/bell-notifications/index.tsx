import * as React from 'react';
import { FocusOn } from 'react-focus-on';
import { BellBadgeIcon, BellIcon } from '@dashlane/ui-components';
import { PageView } from '@dashlane/hermes';
import { Notifications } from '@dashlane/communication';
import { Button, jsx } from '@dashlane/design-system';
import { Dropdown, DropdownAlignment, DropdownPosition, } from 'libs/dashlane-style/dropdown';
import { logPageView } from 'libs/logs/logEvent';
import { logCurrentRoutePageView } from 'libs/logs/pageViewUtils';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { useLocation } from 'libs/router';
import useTranslate from 'libs/i18n/useTranslate';
import { NotificationsHub } from 'webapp/notifications-hub/notifications-hub';
import { useHasNotifications } from 'webapp/bell-notifications/use-has-notifications';
export interface Props {
    color?: string;
    notifications: Notifications;
}
const NotificationsDropdown: React.FC<Props> = ({ color }) => {
    const { routes } = useRouterGlobalSettingsContext();
    const { translate } = useTranslate();
    const hasNotifications = useHasNotifications();
    const [isOpen, setIsOpen] = React.useState(false);
    const location = useLocation();
    const wasOpenRef = React.useRef(isOpen);
    React.useEffect(() => {
        wasOpenRef.current = isOpen;
    });
    const wasOpen = wasOpenRef.current;
    React.useEffect(() => {
        if (isOpen && !wasOpen) {
            logPageView(PageView.NotificationSharingList);
        }
        else if (!isOpen && wasOpen) {
            logCurrentRoutePageView(location.pathname, routes);
        }
    }, [isOpen, location, routes, wasOpen]);
    const onToggle = React.useCallback((newIsOpen: boolean) => {
        setIsOpen(newIsOpen);
    }, [setIsOpen]);
    const renderMenuItem = React.useCallback((toggle: () => void) => {
        const NotificationIcon = isOpen || !hasNotifications ? (<BellIcon color={color} style={{ pointerEvents: 'none' }}/>) : (<BellBadgeIcon color={color} style={{ pointerEvents: 'none' }}/>);
        return (<div sx={{
                display: 'inline-block',
                height: '100%',
            }}>
          <Button onClick={toggle} aria-label={translate('webapp_sharing_notifications_view_notifications')} mood="neutral" intensity="supershy" layout="iconOnly" icon={NotificationIcon}/>
        </div>);
    }, [color, hasNotifications, isOpen, translate]);
    return (<Dropdown alignment={DropdownAlignment.End} position={DropdownPosition.Bottom} onToggle={onToggle} withBackdrop={true} renderRoot={renderMenuItem}>
      <FocusOn autoFocus={true}>
        <NotificationsHub />
      </FocusOn>
    </Dropdown>);
};
export default NotificationsDropdown;
