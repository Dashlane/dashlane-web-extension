import React from 'react';
import classnames from 'classnames';
import { SharingNotifications } from 'webapp/sharing-notifications/sharing-notifications';
import { useSideMenuCollapsedContext } from 'webapp/sidemenu/side-menu-collapsed-context';
import styles from './notifications-hub.css';
export const NotificationsHub = () => {
    const { isSideMenuCollapsed } = useSideMenuCollapsedContext();
    const notificationsHubClassName = classnames(styles.notificationsHub, {
        [styles.narrow]: !isSideMenuCollapsed,
    });
    return (<div className={notificationsHubClassName} tabIndex={0}>
      <SharingNotifications fullPage={false} triggerSync={false}/>
    </div>);
};
