import { DataStatus } from '@dashlane/framework-react';
import { useTeamSpaceContext } from 'team/settings/components/TeamSpaceContext';
import { useUserGroups } from 'webapp/sharing-center/group/useUserGroups';
export interface UseHasSharedAnItemWithAGroup {
    status: DataStatus;
    hasSharedAnItemWithAGroup?: boolean;
}
export const useHasSharedAnItemWithAGroup = (): UseHasSharedAnItemWithAGroup => {
    const { currentSpaceId } = useTeamSpaceContext();
    const userGroups = useUserGroups('ascend', currentSpaceId);
    if (userGroups.status !== DataStatus.Success) {
        return {
            status: userGroups.status,
        };
    }
    return {
        status: DataStatus.Success,
        hasSharedAnItemWithAGroup: !!userGroups.data.items?.find((group) => group.itemCount > 0),
    };
};
