import { SharingUserView, UserGroupDownload } from '@dashlane/communication';
export const getGroupsFilteredByQuery = (groups: UserGroupDownload[], query: string) => groups.filter((group) => group.name.toLowerCase().includes(query.trim().toLowerCase()));
export const getUsersFilteredByQuery = (users: SharingUserView[], query: string) => users.filter((user) => user.id.toLowerCase().includes(query.trim().toLowerCase()));
export const getGroupOrUserId = (index: number, filteredGroupsCount: number, filteredUsers: SharingUserView[], filteredGroups: UserGroupDownload[]) => {
    return index > filteredGroupsCount - 1
        ? filteredUsers[index - filteredGroupsCount].id
        : filteredGroups[index].groupId;
};
