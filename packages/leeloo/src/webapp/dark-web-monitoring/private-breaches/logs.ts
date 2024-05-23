import { ItemType, SecurityAlertType, UserDismissSecurityAlertEvent, UserReceiveSecurityAlertEvent, } from '@dashlane/hermes';
import { logEvent } from 'libs/logs/logEvent';
export const logUserDismissSecurityAlert = (securityAlertId: string) => {
    logEvent(new UserDismissSecurityAlertEvent({
        itemTypesAffected: [ItemType.SecurityBreach],
        securityAlertItemId: securityAlertId,
        securityAlertType: SecurityAlertType.DarkWeb,
    }));
};
export const logUserReceiveSecurityAlert = (securityAlertId: string) => {
    logEvent(new UserReceiveSecurityAlertEvent({
        itemTypesAffected: [ItemType.SecurityBreach],
        securityAlertItemId: securityAlertId,
        securityAlertType: SecurityAlertType.DarkWeb,
    }));
};
