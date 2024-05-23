import React from 'react';
import { DataStatus, useModuleQueries } from '@dashlane/framework-react';
import { Permission, sharingItemsApi } from '@dashlane/sharing-contracts';
import { Props as ComponentProps, NoteEditPanelComponent, } from './secure-notes-edit-component';
export const SecureNotesEditGrapheneComponent = (props: ComponentProps) => {
    const { note } = props;
    const { getPermissionForItem, getSharingStatusForItem, getIsLastAdminForItem, } = useModuleQueries(sharingItemsApi, {
        getPermissionForItem: {
            queryParam: {
                itemId: note.id,
            },
        },
        getSharingStatusForItem: {
            queryParam: {
                itemId: note.id,
            },
        },
        getIsLastAdminForItem: {
            queryParam: {
                itemId: note.id,
            },
        },
    }, []);
    if (getPermissionForItem.status !== DataStatus.Success ||
        getSharingStatusForItem.status !== DataStatus.Success ||
        getIsLastAdminForItem.status !== DataStatus.Success) {
        return null;
    }
    const { isShared, isSharedViaUserGroup } = getSharingStatusForItem.data;
    const { permission } = getPermissionForItem.data;
    const { isLastAdmin } = getIsLastAdminForItem.data;
    const isAdmin = isShared && permission === Permission.Admin;
    return (<NoteEditPanelComponent {...props} isShared={isShared} isAdmin={isAdmin} isSharedViaUserGroup={isSharedViaUserGroup} isLastAdmin={isLastAdmin}/>);
};
