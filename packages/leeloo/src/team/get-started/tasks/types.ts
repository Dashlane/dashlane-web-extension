export enum GetStartedTaskName {
    CREATE_ACCOUNT = 'createAccount',
    VISIT_VAULT = 'visitVault',
    INVITE_MEMBERS = 'inviteMembers',
    ASSIGN_ADMIN = 'assignAdmin',
    CREATE_SHARING_GROUP = 'createSharingGroup',
    SHARE_ITEM = 'shareItem',
    CHECK_PASSWORD_HEALTH = 'checkPasswordHealth'
}
export interface GetStartedTaskProps {
    isUpNext: boolean;
    isCompleted: boolean;
    isCtaDisabled?: boolean;
    isDisabled?: boolean;
}
