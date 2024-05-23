import React from 'react';
import { FollowUpNotificationActions, UserFollowUpNotificationEvent, } from '@dashlane/hermes';
import { DataStatus, useModuleCommands, useModuleQuery, } from '@dashlane/framework-react';
import { autofillSettingsApi } from '@dashlane/autofill-contracts';
import { jsx, Toggle } from '@dashlane/design-system';
import useTranslate from 'src/libs/i18n/useTranslate';
import { logEvent } from 'src/libs/logs/logEvent';
import { SX_STYLES } from './preferences-content.styles';
interface Props {
    readOnly: boolean;
}
const I18N_KEYS = {
    FOLLOW_UP_NOTIFICATION: 'tab/autofill_settings/preferences/follow_up_notification',
    FOLLOW_UP_NOTIFICATION_DISABLED: 'tab/autofill_settings/preferences/follow_up_notification_disabled_information',
};
export const WebcardsSettingsContent = ({ readOnly }: Props) => {
    const { translate } = useTranslate();
    const getAutofillSettings = useModuleQuery(autofillSettingsApi, 'getAutofillSettings');
    const { enableFollowUpNotification, disableFollowUpNotification } = useModuleCommands(autofillSettingsApi);
    const isFollowUpNotificationEnabled = getAutofillSettings.status === DataStatus.Success &&
        getAutofillSettings.data.isFollowUpNotificationEnabled;
    const toggleFollowUpNotification = () => {
        if (isFollowUpNotificationEnabled) {
            void logEvent(new UserFollowUpNotificationEvent({
                action: FollowUpNotificationActions.DeactivateFeature,
            }));
            void disableFollowUpNotification();
        }
        else {
            void logEvent(new UserFollowUpNotificationEvent({
                action: FollowUpNotificationActions.ActivateFeature,
            }));
            void enableFollowUpNotification();
        }
    };
    return (<React.Fragment>
      <div sx={SX_STYLES.TOGGLE_OPTION_CONTAINER}>
        <Toggle label={translate(I18N_KEYS.FOLLOW_UP_NOTIFICATION)} description={!isFollowUpNotificationEnabled
            ? translate(I18N_KEYS.FOLLOW_UP_NOTIFICATION_DISABLED)
            : null} onChange={toggleFollowUpNotification} checked={isFollowUpNotificationEnabled} sx={{ fontSize: '14px' }} readOnly={readOnly}/>
      </div>
    </React.Fragment>);
};
