import { jsx } from '@dashlane/design-system';
import { DataStatus, useModuleCommands, useModuleQuery, } from '@dashlane/framework-react';
import { vaultNotificationsApi } from '@dashlane/vault-contracts';
import useTranslate from 'libs/i18n/useTranslate';
import { NewFeatureNotification } from 'webapp/notifications/new-feature-notification';
const I18N_KEYS = {
    DESCRIPTION: 'webapp_collection_guide_tooltip_description',
    TITLE: 'webapp_collection_guide_tooltip_title',
};
interface Coordinates {
    x: number;
    y: number;
}
interface Props {
    buttonCoordinates: Coordinates;
}
export const CollectionGuidedIntro = ({ buttonCoordinates }: Props) => {
    const { translate } = useTranslate();
    const { setVaultNotificationsStatus } = useModuleCommands(vaultNotificationsApi);
    const { data: notifications, status: notificationsStatus } = useModuleQuery(vaultNotificationsApi, 'getVaultNotificationsStatus');
    if (notificationsStatus !== DataStatus.Success ||
        !notifications.isCollectionGuidedIntroEnabled) {
        return null;
    }
    const setNotificationSeen = () => {
        return setVaultNotificationsStatus({
            notificationName: 'isCollectionGuidedIntroEnabled',
            isEnabled: false,
        });
    };
    return (<NewFeatureNotification buttonCoordinates={buttonCoordinates} title={translate(I18N_KEYS.TITLE)} description={translate(I18N_KEYS.DESCRIPTION)} setIsNotificationVisible={setNotificationSeen}/>);
};
