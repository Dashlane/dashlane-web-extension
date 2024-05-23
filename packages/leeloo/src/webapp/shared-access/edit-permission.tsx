import * as React from 'react';
import { MemberPermission, Recipient } from '@dashlane/communication';
import { carbonConnector } from 'libs/carbon/connector';
import { PermissionDialog } from 'webapp/shared-access/permission-dialog';
import { PermissionDialogStep } from 'webapp/shared-access/types';
export type MemberPermissionPlusRevoke = MemberPermission | 'revoke';
export interface Props {
    isOpen: boolean;
    onDismiss: () => void;
    itemGroupId?: string;
    originPermission: MemberPermission;
    recipient: Recipient;
    isLoading: boolean;
}
export const EditPermission = ({ isOpen, onDismiss, itemGroupId, originPermission, recipient, isLoading, }: Props) => {
    const [permission, setPermissions] = React.useState<MemberPermissionPlusRevoke>(originPermission);
    const [permissionDialogStep, setPermissionDialogStep] = React.useState<PermissionDialogStep>(PermissionDialogStep.Permission);
    const [permissionDialogLoading, setPermissionDialogLoading] = React.useState(false);
    React.useEffect(() => {
        setPermissions(originPermission);
    }, [originPermission]);
    const onRevokeAccess = async (recipientToRevoke: Recipient): Promise<boolean> => {
        if (!itemGroupId) {
            return false;
        }
        try {
            const { success } = await carbonConnector.revokeSharing({
                itemGroupId,
                recipient: recipientToRevoke,
            });
            return success;
        }
        catch (_e) {
            return false;
        }
    };
    const onEditPermission = async (recipientToEdit: Recipient, newPermission: MemberPermission): Promise<boolean> => {
        if (!itemGroupId) {
            return false;
        }
        try {
            const { success } = await carbonConnector.updateSharingPermission({
                itemGroupId,
                recipient: recipientToEdit,
                permission: newPermission,
            });
            return success;
        }
        catch (_e) {
            return false;
        }
    };
    const confirmValidateChangePermission = async () => {
        setPermissionDialogLoading(true);
        const res = permission === 'revoke'
            ? await onRevokeAccess(recipient)
            : await onEditPermission(recipient, permission);
        if (res) {
            const step = permission === 'revoke'
                ? PermissionDialogStep.RevokeSuccess
                : PermissionDialogStep.Success;
            setPermissionDialogStep(step);
        }
        else {
            setPermissionDialogStep(PermissionDialogStep.Failure);
        }
        setPermissionDialogLoading(false);
    };
    const validateChangePermission = () => {
        if (permission === 'revoke') {
            setPermissionDialogStep(PermissionDialogStep.ConfirmRevoke);
        }
        else {
            confirmValidateChangePermission();
        }
    };
    const cancelRevoke = () => {
        setPermissionDialogStep(PermissionDialogStep.Permission);
    };
    const selectPermission = (permissionToSelect: MemberPermission | 'revoke') => {
        setPermissions(permissionToSelect);
    };
    const onDialogDismiss = () => {
        setPermissionDialogStep(PermissionDialogStep.Permission);
        onDismiss();
    };
    return (<PermissionDialog isOpen={isOpen} loading={permissionDialogLoading || isLoading} onCancelRevoke={cancelRevoke} onConfirmRevoke={confirmValidateChangePermission} onDismiss={onDialogDismiss} onSelectPermission={selectPermission} onValidatePermission={validateChangePermission} originPermission={originPermission} permission={permission} recipient={recipient} step={permissionDialogStep}/>);
};
