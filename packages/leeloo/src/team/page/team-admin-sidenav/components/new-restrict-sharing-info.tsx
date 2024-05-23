import { jsx } from '@dashlane/design-system';
import { DataStatus, useModuleCommands, useModuleQuery, } from '@dashlane/framework-react';
import { teamAdminNotificationsApi } from '@dashlane/team-admin-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import { NewFeatureNotification } from 'webapp/notifications/new-feature-notification';
const I18N_KEYS = {
    DESCRIPTION: 'team_tooltip_description_restrict_sharing_info',
    TITLE: 'team_tooltip_title_restrict_sharing_info',
};
export const NewRestrictSharingInfo = () => {
    const { translate } = useTranslate();
    const { markNewRestrictSharingPolicySeen } = useModuleCommands(teamAdminNotificationsApi);
    const { data: hasSeenNewRestrictSharingPolicy, status: notificationsStatus } = useModuleQuery(teamAdminNotificationsApi, 'hasSeenNewRestrictSharingPolicy');
    if (notificationsStatus !== DataStatus.Success ||
        hasSeenNewRestrictSharingPolicy) {
        return null;
    }
    return (<NewFeatureNotification title={translate(I18N_KEYS.TITLE)} description={translate(I18N_KEYS.DESCRIPTION)} setIsNotificationVisible={markNewRestrictSharingPolicySeen}/>);
};
