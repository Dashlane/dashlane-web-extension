import { DataStatus } from '@dashlane/carbon-api-consumers';
import { useModuleQuery } from '@dashlane/framework-react';
import { sharingItemsApi } from '@dashlane/sharing-contracts/';
export interface UseItemItemGroup {
    itemGroupId?: string;
    collectionIds: string[];
    isReady: boolean;
}
export function useItemItemGroup(itemId: string): UseItemItemGroup {
    const itemGroupResult = useModuleQuery(sharingItemsApi, 'getItemGroupForItem', {
        itemId,
    });
    if (itemGroupResult.status !== DataStatus.Success) {
        return {
            isReady: false,
            collectionIds: [],
        };
    }
    const itemGroupData = itemGroupResult.data;
    return {
        itemGroupId: itemGroupData?.itemGroupId,
        collectionIds: itemGroupData?.collectionIds,
        isReady: true,
    };
}
