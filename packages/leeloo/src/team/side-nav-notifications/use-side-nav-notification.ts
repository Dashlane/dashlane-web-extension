import * as React from 'react';
import { SideNavNotificationContext } from './side-nav-notification-provider';
export const useSideNavNotification = () => {
    const context = React.useContext(SideNavNotificationContext);
    if (!context) {
        throw new Error(`useSideNavNotification must be called from within an SideNavNotificationProvider`);
    }
    return context;
};
