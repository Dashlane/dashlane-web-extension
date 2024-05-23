import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
import { sharingInvitesApi } from '@dashlane/sharing-contracts';
export const useHasNotifications = () => {
    const hasInvitesQuery = useModuleQuery(sharingInvitesApi, 'hasInvites');
    const hasNotifications = hasInvitesQuery.status === DataStatus.Success
        ? hasInvitesQuery.data
        : false;
    return hasNotifications;
};
