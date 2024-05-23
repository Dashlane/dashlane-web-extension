import { useEffect } from 'react';
import { jsx } from '@dashlane/design-system';
import { PageView } from '@dashlane/hermes';
import { RevokeUserGroupMembersRequest, UserGroupDownload, } from '@dashlane/communication';
import { LeeWithStorage } from 'lee';
import { deleteUserGroup, GlobalDispatcher, renameUserGroup, } from 'libs/carbon/triggers';
import { carbonConnector } from 'libs/carbon/connector';
import useTranslate from 'libs/i18n/useTranslate';
import { websiteLogAction } from 'libs/logs';
import { logPageView } from 'libs/logs/logEvent';
import { redirect, useRouterGlobalSettingsContext } from 'libs/router';
import { Alert } from 'team/alerts/types';
import { useAlertQueue } from 'team/alerts/use-alert-queue';
import { useCreateSharingGroupNotification } from 'team/get-started/hooks/notifications';
import { GroupPage } from '../page';
import { GROUP_NAME_ALREADY_IN_USE, GROUP_RENAMING_FAILED } from './types';
import Header from './header';
import MemberList from './member-list';
const I18N_KEYS = {
    DELETE_GROUP_ERROR_TITLE: 'team_groups_edit_delete_group_error_title',
    DELETE_GROUP_ERROR_MESSAGE: 'team_groups_edit_delete_group_error_message',
    RENAME_GROUP_ERROR_TITLE: 'team_groups_edit_rename_group_error_title',
    RENAME_GROUP_ERROR_MESSAGE: 'team_groups_edit_rename_group_error_message',
};
export interface EditGroupProps {
    lee: LeeWithStorage<Record<string, unknown>>;
    userGroup: UserGroupDownload;
    match: {
        params: {
            uuid: string;
        };
    };
}
export const EditGroup = ({ lee, userGroup }: EditGroupProps) => {
    const { routes } = useRouterGlobalSettingsContext();
    const { translate } = useTranslate();
    const { addAlertToQueue } = useAlertQueue();
    useCreateSharingGroupNotification();
    useEffect(() => {
        logPageView(PageView.TacGroupDetails);
    }, []);
    const reportError = (dispatchGlobal: GlobalDispatcher, alert: Alert, message: string, content: string) => {
        try {
            const error = JSON.parse(content);
            if (error['code']) {
                alert.message += ` : ${error['code']}`;
            }
        }
        finally {
            dispatchGlobal(websiteLogAction.error({
                message,
                content: { error: content },
            }));
            addAlertToQueue(alert);
        }
    };
    const onBackLinkClick = () => {
        redirect(routes.teamGroupsRoutePath);
    };
    const onConfirmDeleteGroupClick = () => {
        const { groupId, revision } = userGroup;
        deleteUserGroup({ groupId, revision })
            .then(() => {
            redirect(routes.teamGroupsRoutePath);
        })
            .catch((error) => {
            const alert = {
                title: translate(I18N_KEYS.DELETE_GROUP_ERROR_TITLE),
                message: translate(I18N_KEYS.DELETE_GROUP_ERROR_MESSAGE),
            };
            reportError(lee.dispatchGlobal, alert, 'Group deletion failed', error.message);
        });
    };
    const handleGroupRenamed = async (name: string): Promise<{
        success: boolean;
        error?: string;
    }> => {
        if (name === userGroup.name) {
            return { success: true };
        }
        const reportRenamingError = (error: Error, description: string) => {
            const alert = {
                title: translate(I18N_KEYS.RENAME_GROUP_ERROR_TITLE),
                message: translate(I18N_KEYS.RENAME_GROUP_ERROR_MESSAGE),
            };
            reportError(lee.dispatchGlobal, alert, description, error.message);
            return { success: false, error: GROUP_RENAMING_FAILED };
        };
        try {
            const isAvailable = await carbonConnector.isGroupNameAvailable(name);
            if (!isAvailable) {
                return { success: false, error: GROUP_NAME_ALREADY_IN_USE };
            }
        }
        catch (error) {
            return reportRenamingError(error, 'Group name availability check failed');
        }
        try {
            const { groupId, revision } = userGroup;
            await renameUserGroup({ groupId, revision, name });
            return { success: true };
        }
        catch (error) {
            return reportRenamingError(error, 'Group renaming failed');
        }
    };
    const revokeMembers = (dispatchGlobal: GlobalDispatcher, params: RevokeUserGroupMembersRequest, alert: Alert) => {
        try {
            carbonConnector.revokeUserGroupMembers(params).then(({ error }) => {
                if (error) {
                    reportError(dispatchGlobal, alert, 'Revoke member from group failed', error.message);
                }
            });
        }
        catch (error) {
            reportError(dispatchGlobal, alert, 'Revoke member from group failed', error.message);
        }
    };
    if (!userGroup) {
        return null;
    }
    const header = (<Header onBackLinkClick={onBackLinkClick} onDeleteClick={onConfirmDeleteGroupClick} onRenameGroup={handleGroupRenamed} groupName={userGroup.name} lee={lee.child()} userGroup={userGroup}/>);
    return (<GroupPage header={header}>
      <MemberList lee={lee.child()} userGroup={userGroup} revokeMembers={revokeMembers}/>
    </GroupPage>);
};
