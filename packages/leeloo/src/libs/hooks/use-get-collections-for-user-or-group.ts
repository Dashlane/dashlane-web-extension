import { sharingCollectionsApi } from '@dashlane/sharing-contracts';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
export const useGetCollectionsForUserOrGroup = (id: string) => {
    return useModuleQuery(sharingCollectionsApi, 'getCollectionsForUserOrGroup', {
        targetId: id,
    });
};
export const useGetCollectionsForUserOrGroupData = (id: string) => {
    const result = useGetCollectionsForUserOrGroup(id);
    return result.status === DataStatus.Success ? result.data?.collections : [];
};
