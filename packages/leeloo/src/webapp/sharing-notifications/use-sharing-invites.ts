import { sharingInvitesApi } from '@dashlane/sharing-contracts';
import { useModuleQuery } from '@dashlane/framework-react';
export const useSharingInvites = () => {
    return useModuleQuery(sharingInvitesApi, 'getInvites');
};
