import { sharingCollectionsApi } from '@dashlane/sharing-contracts';
import { DataStatus, useModuleQuery } from '@dashlane/framework-react';
export const useCollectionUsersAndGroups = (ids: string[]) => {
    return useModuleQuery(sharingCollectionsApi, 'usersAndGroupsInCollection', {
        collectionUUIDs: ids,
    });
};
export const useCollectionUsersAndGroupsData = (ids: string[]) => {
    const result = useCollectionUsersAndGroups(ids);
    return result.status === DataStatus.Success ? result.data : {};
};
