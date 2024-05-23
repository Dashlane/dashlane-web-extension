import { Button, UserClickEvent } from '@dashlane/hermes';
import { logEvent } from 'libs/logs/logEvent';
export const logOpenUsersClick = () => {
    logEvent(new UserClickEvent({
        button: Button.OpenUsersPage,
    }));
};
export const logOpenGroupsClick = () => {
    logEvent(new UserClickEvent({
        button: Button.OpenGroupsPage,
    }));
};
export const logOpenDashboardClick = () => {
    logEvent(new UserClickEvent({
        button: Button.OpenDashboard,
    }));
};
export const logOpenSharingCenterClick = () => {
    logEvent(new UserClickEvent({
        button: Button.OpenSharingCenter,
    }));
};
export const logOpenVaultClick = () => {
    logEvent(new UserClickEvent({
        button: Button.OpenVault,
    }));
};
