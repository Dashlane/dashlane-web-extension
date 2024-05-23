import React, { useEffect, useState } from 'react';
import { Alert, AlertSeverity, AlertWrapper } from '@dashlane/ui-components';
import { LoginNotificationType } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
import useTranslate from 'libs/i18n/useTranslate';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { useGetLoginNotifications } from './use-get-login-notifications';
export const I18N_NAMES = {
    RELOGIN_NEEDED: 'webapp_login_notification_re_login',
    SSO_FEATURE_BLOCKED: 'webapp_login_notification_sso_feature_blocked',
    SSO_SETUP_ERROR: 'webapp_login_notification_sso_setup_error',
    ACCEPT_TEAM_INVITE_ERROR: 'standalone_account_creation_error_invite_link_acceptance_failed',
    ACCEPT_TEAM_INVITE_SUCCESS: 'standalone_account_creation_error_invite_link_acceptance_success',
    UNKNOWN_ERROR: 'webapp_login_notification_unknown_error',
    DISMISS: '_common_alert_dismiss_button',
};
export interface LoginAlert {
    message: string;
    severity: AlertSeverity;
}
export const LoginNotifications = () => {
    const [alertList, setAlertList] = useState<LoginAlert[] | null>(null);
    const { translate } = useTranslate();
    const matchAlertToType = (type: LoginNotificationType, message: string | undefined): LoginAlert => {
        switch (type) {
            case LoginNotificationType.SSO_FEATURE_BLOCKED:
                return {
                    message: translate(I18N_NAMES.SSO_FEATURE_BLOCKED),
                    severity: AlertSeverity.WARNING,
                };
            case LoginNotificationType.SSO_SETUP_ERROR:
                return {
                    message: translate(I18N_NAMES.SSO_SETUP_ERROR),
                    severity: AlertSeverity.WARNING,
                };
            case LoginNotificationType.RELOGIN_NEEDED:
                return {
                    message: translate(I18N_NAMES.RELOGIN_NEEDED),
                    severity: AlertSeverity.STRONG,
                };
            case LoginNotificationType.TEAM_ACCEPTANCE_SUCCESS:
                return {
                    message: translate(I18N_NAMES.ACCEPT_TEAM_INVITE_SUCCESS),
                    severity: AlertSeverity.SUCCESS,
                };
            case LoginNotificationType.TEAM_ACCEPTANCE_ERROR:
                return {
                    message: translate(I18N_NAMES.ACCEPT_TEAM_INVITE_ERROR),
                    severity: AlertSeverity.WARNING,
                };
            case LoginNotificationType.UNKNOWN_ERROR:
            default:
                return {
                    message: translate(I18N_NAMES.UNKNOWN_ERROR, { message }),
                    severity: AlertSeverity.WARNING,
                };
        }
    };
    const notificationHook = useGetLoginNotifications();
    const notificationList = notificationHook.status === DataStatus.Success && notificationHook.data;
    useEffect(() => {
        if (notificationList && notificationList.length > 0) {
            setAlertList(notificationList.map((item) => {
                return matchAlertToType(item.type, item.message);
            }));
        }
        else {
            setAlertList(null);
        }
    }, [notificationList]);
    const clearStoredLoginNotifications = () => {
        carbonConnector.clearAllStoredLoginNotification();
    };
    return (<AlertWrapper>
      {alertList &&
            alertList.length > 0 &&
            alertList.map((item, idx) => (<Alert key={`${idx}-${item.message}`} severity={item.severity} closeIconName={translate(I18N_NAMES.DISMISS)} onClose={clearStoredLoginNotifications}>
            {item.message}
          </Alert>))}
    </AlertWrapper>);
};
