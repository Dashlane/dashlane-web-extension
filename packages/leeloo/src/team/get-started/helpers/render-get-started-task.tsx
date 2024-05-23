import React from 'react';
import { TaskListItem } from '../hooks/use-task-list';
import { AssignAdminTask, CheckPasswordHealthTask, CreateAccountTask, CreateSharingGroupTask, InviteMembersTask, ShareItemTask, VisitVaultTask, } from '../tasks';
import { GetStartedTaskName, GetStartedTaskProps } from '../tasks/types';
const keyToComponentMapper = {
    [GetStartedTaskName.CREATE_ACCOUNT]: CreateAccountTask,
    [GetStartedTaskName.VISIT_VAULT]: VisitVaultTask,
    [GetStartedTaskName.INVITE_MEMBERS]: InviteMembersTask,
    [GetStartedTaskName.ASSIGN_ADMIN]: AssignAdminTask,
    [GetStartedTaskName.CREATE_SHARING_GROUP]: CreateSharingGroupTask,
    [GetStartedTaskName.SHARE_ITEM]: ShareItemTask,
    [GetStartedTaskName.CHECK_PASSWORD_HEALTH]: CheckPasswordHealthTask,
};
export const renderGetStartedTask = ({ key, ...rest }: TaskListItem & GetStartedTaskProps) => {
    if (!keyToComponentMapper[key]) {
        return null;
    }
    const Component = keyToComponentMapper[key];
    return <Component key={key} {...rest}/>;
};
