import { useState } from 'react';
import { jsx } from '@dashlane/design-system';
import { LoadingIcon } from '@dashlane/ui-components';
import { DataStatus } from '@dashlane/framework-react';
import { isGroupRecipient, MemberPermission, Recipient, } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
import useTranslate from 'libs/i18n/useTranslate';
import { PermissionDialog } from './permission-dialog';
import { PermissionDialogStep } from './types';
import { SharedAccessRecipient } from './shared-access-recipient';
import { useSharedAccessData } from './hooks/use-shared-access-data';
import { ContentCard } from 'webapp/panel/standard/content-card';
export interface SharedAccessProps {
    id: string;
    isAdmin: boolean;
}
type MemberPermissionPlusRevoke = MemberPermission | 'revoke';
export interface DialogState {
    originPermission: MemberPermissionPlusRevoke;
    permission: MemberPermissionPlusRevoke;
    recipient: Recipient;
    step: PermissionDialogStep;
}
const I18N_KEYS = {
    COLLECTIONS: 'webapp_shared_access_collections',
    GROUPS: 'webapp_shared_access_groups_card_title',
    INDIVIDUALS: 'webapp_shared_access_individuals_card_title',
};
export const SharedAccess = ({ id, isAdmin }: SharedAccessProps) => {
    const { translate } = useTranslate();
    const [isDialogLoading, setIsDialogLoading] = useState<boolean>(false);
    const [dialog, setDialog] = useState<DialogState | null>(null);
    const { data, status } = useSharedAccessData(id);
    if (status !== DataStatus.Success) {
        return (<LoadingIcon color="ds.container.expressive.brand.catchy.idle" size={50} sx={{ alignSelf: 'center', m: '20px' }}/>);
    }
    const { itemGroupId, users, groups, collections } = data;
    const onRevokeAccess = async (recipient: Recipient): Promise<boolean> => {
        try {
            const { success } = await carbonConnector.revokeSharing({
                itemGroupId: itemGroupId ?? '',
                recipient,
            });
            return success;
        }
        catch (_e) {
            return false;
        }
    };
    const onEditPermission = async (recipient: Recipient, permission: MemberPermission): Promise<boolean> => {
        try {
            const { success } = await carbonConnector.updateSharingPermission({
                itemGroupId: itemGroupId ?? '',
                recipient,
                permission,
            });
            return success;
        }
        catch (_e) {
            return false;
        }
    };
    const updateDialogStep = (step: PermissionDialogStep) => {
        if (dialog) {
            setDialog({ ...dialog, step });
        }
    };
    const confirmValidateChangePermission = async () => {
        if (!dialog) {
            return;
        }
        const { recipient, permission } = dialog;
        setIsDialogLoading(true);
        const res = permission === 'revoke'
            ? await onRevokeAccess(recipient)
            : await onEditPermission(recipient, permission);
        if (res) {
            const step = permission === 'revoke'
                ? PermissionDialogStep.RevokeSuccess
                : PermissionDialogStep.Success;
            updateDialogStep(step);
        }
        else {
            updateDialogStep(PermissionDialogStep.Failure);
        }
        setIsDialogLoading(false);
    };
    const validateChangePermission = () => {
        if (dialog?.permission === 'revoke') {
            setDialog({
                ...dialog,
                step: PermissionDialogStep.ConfirmRevoke,
            });
        }
        else {
            confirmValidateChangePermission();
        }
    };
    const cancelRevoke = () => {
        if (!dialog) {
            return;
        }
        setDialog({
            ...dialog,
            step: PermissionDialogStep.Permission,
        });
    };
    const openEditPermissionsDialog = (recipient: Recipient, permission: MemberPermissionPlusRevoke) => {
        const permissionsDialog = {
            recipient,
            permission,
            originPermission: permission,
            step: PermissionDialogStep.Permission,
            name: isGroupRecipient(recipient) ? recipient.name : recipient.alias,
        };
        setDialog(permissionsDialog);
    };
    const selectPermission = (permission: MemberPermission | 'revoke') => {
        if (!dialog) {
            return;
        }
        setDialog({ ...dialog, permission });
    };
    const hasGroups = groups?.length > 0;
    const hasCollections = collections?.length > 0;
    const hasUsers = users?.length > 0;
    return (<div sx={{ flex: '1', overflowY: 'auto' }}>
      <ul sx={{ flex: '1' }}>
        {hasCollections ? (<ContentCard title={translate(I18N_KEYS.COLLECTIONS)} additionalSx={{ marginBottom: '16px' }}>
            {collections.map((collection) => (<SharedAccessRecipient key={collection.recipientId} isAdmin={isAdmin} member={collection} itemGroupId={itemGroupId ?? ''} openEditPermissionsDialog={openEditPermissionsDialog}/>))}
          </ContentCard>) : null}
        {hasGroups ? (<ContentCard title={translate(I18N_KEYS.GROUPS)} additionalSx={{ marginBottom: '16px' }}>
            {groups.map((group) => (<SharedAccessRecipient key={group.recipientId} isAdmin={isAdmin} member={group} itemGroupId={itemGroupId ?? ''} openEditPermissionsDialog={openEditPermissionsDialog}/>))}
          </ContentCard>) : null}
        {hasUsers ? (<ContentCard title={translate(I18N_KEYS.INDIVIDUALS)}>
            {users.map((user) => (<SharedAccessRecipient key={user.recipientId} isAdmin={isAdmin} member={user} itemGroupId={itemGroupId ?? ''} openEditPermissionsDialog={openEditPermissionsDialog}/>))}
          </ContentCard>) : null}
      </ul>
      {dialog && (<PermissionDialog isOpen loading={isDialogLoading} onCancelRevoke={cancelRevoke} onConfirmRevoke={confirmValidateChangePermission} onDismiss={() => setDialog(null)} onSelectPermission={selectPermission} onValidatePermission={validateChangePermission} originPermission={dialog.originPermission} permission={dialog.permission} recipient={dialog.recipient} step={dialog.step}/>)}
    </div>);
};
