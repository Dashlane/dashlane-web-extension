import { DataStatus } from '@dashlane/carbon-api-consumers';
import { useHasSharedGroupWithMembers } from './use-has-shared-group-with-members';
import { useHasSharedAnItemWithAGroup } from './use-has-shared-an-item-with-a-group';
import { GetStartedTaskName } from '../tasks/types';
import { useHasVisitedVault } from './use-has-visited-vault';
import { useTeamTasksCompletion } from './use-team-tasks-completion';
export interface TaskListItem {
    key: GetStartedTaskName;
    isCompleted: boolean;
    isDisabled?: boolean;
    isCtaDisabled?: boolean;
}
export interface UseTaskList {
    isLoading: boolean;
    tasks: TaskListItem[];
}
export const useTaskList = (): UseTaskList => {
    const { hasSharedGroupWithMembers = false, status: hasSharedGroupWithMembersStatus, } = useHasSharedGroupWithMembers();
    const { hasSharedAnItemWithAGroup = false, status: hasSharedAnItemWithAGroupStatus, } = useHasSharedAnItemWithAGroup();
    const { hasVisitedVault } = useHasVisitedVault();
    const { hasMinimumMemberCount, hasMoreThanOneAdmin, hasSecurityScore, hasOnlyOneMember, isSharingDisabled, status: teamTasksCompletionStatus, } = useTeamTasksCompletion();
    if (hasSharedGroupWithMembersStatus === DataStatus.Loading ||
        hasSharedAnItemWithAGroupStatus === DataStatus.Loading ||
        teamTasksCompletionStatus === DataStatus.Loading) {
        return { isLoading: true, tasks: [] };
    }
    const tasks: TaskListItem[] = [
        {
            key: GetStartedTaskName.CREATE_ACCOUNT,
            isCompleted: true,
        },
        {
            key: GetStartedTaskName.VISIT_VAULT,
            isCompleted: hasVisitedVault ?? false,
        },
        {
            key: GetStartedTaskName.INVITE_MEMBERS,
            isCompleted: hasMinimumMemberCount,
        },
        {
            key: GetStartedTaskName.ASSIGN_ADMIN,
            isCompleted: hasMoreThanOneAdmin,
            isCtaDisabled: hasOnlyOneMember,
        },
        {
            key: GetStartedTaskName.CREATE_SHARING_GROUP,
            isCompleted: hasSharedGroupWithMembers,
            isCtaDisabled: hasOnlyOneMember,
            isDisabled: isSharingDisabled,
        },
        {
            key: GetStartedTaskName.SHARE_ITEM,
            isCompleted: hasSharedAnItemWithAGroup,
            isCtaDisabled: !hasSharedGroupWithMembers,
            isDisabled: isSharingDisabled,
        },
        {
            key: GetStartedTaskName.CHECK_PASSWORD_HEALTH,
            isCtaDisabled: !hasSecurityScore,
            isCompleted: hasSecurityScore,
        },
    ];
    return {
        isLoading: false,
        tasks,
    };
};
