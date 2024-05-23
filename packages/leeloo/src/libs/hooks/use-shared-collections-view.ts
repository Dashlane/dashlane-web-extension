import { sharingCollectionsApi } from '@dashlane/sharing-contracts';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
export const useSharedCollectionsView = () => {
    return useModuleQuery(sharingCollectionsApi, 'sharedCollectionsWithItems');
};
export const useSharedCollectionsViewData = () => {
    const result = useSharedCollectionsView();
    return result.status === DataStatus.Success ? result.data : [];
};
