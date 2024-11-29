import { useEffect, useState } from "react";
import { useModuleCommands } from "@dashlane/framework-react";
import { isSuccess } from "@dashlane/framework-types";
import {
  Permission,
  SharedAccessMember,
  sharingItemsApi,
} from "@dashlane/sharing-contracts";
import { PermissionDialog } from "./permission-dialog";
import { memberToRecipient } from "./helpers";
import { PermissionDialogStep } from "./types";
export type MemberPermissionPlusRevoke = Permission | "revoke";
export interface Props {
  isOpen: boolean;
  onDismiss: () => void;
  vaultItemId: string;
  recipient: SharedAccessMember;
}
export const EditPermission = ({
  isOpen,
  onDismiss,
  vaultItemId,
  recipient,
}: Props) => {
  const [permission, setPermissions] = useState<MemberPermissionPlusRevoke>(
    recipient.permission
  );
  const [permissionDialogStep, setPermissionDialogStep] =
    useState<PermissionDialogStep>(PermissionDialogStep.Permission);
  const [permissionDialogLoading, setPermissionDialogLoading] = useState(false);
  const { revokeSharedItem, updateSharedItemPermission } =
    useModuleCommands(sharingItemsApi);
  useEffect(() => {
    setPermissions(recipient.permission);
  }, [recipient]);
  const onRevokeAccess = async (
    recipientToRevoke: SharedAccessMember
  ): Promise<boolean> => {
    try {
      const revokeSharedItemCommand = await revokeSharedItem({
        vaultItemId,
        recipient: memberToRecipient(recipientToRevoke),
      });
      return isSuccess(revokeSharedItemCommand);
    } catch (_e) {
      return false;
    }
  };
  const onEditPermission = async (
    recipientToEdit: SharedAccessMember,
    newPermission: Permission
  ): Promise<boolean> => {
    try {
      const updateSharedItemPermissionCommand =
        await updateSharedItemPermission({
          vaultItemId,
          recipient: memberToRecipient(recipientToEdit),
          permission: newPermission,
        });
      return isSuccess(updateSharedItemPermissionCommand);
    } catch (_e) {
      return false;
    }
  };
  const confirmValidateChangePermission = async () => {
    setPermissionDialogLoading(true);
    const res =
      permission === "revoke"
        ? await onRevokeAccess(recipient)
        : await onEditPermission(recipient, permission);
    if (res) {
      const step =
        permission === "revoke"
          ? PermissionDialogStep.RevokeSuccess
          : PermissionDialogStep.Success;
      setPermissionDialogStep(step);
    } else {
      setPermissionDialogStep(PermissionDialogStep.Failure);
    }
    setPermissionDialogLoading(false);
  };
  const validateChangePermission = () => {
    if (permission === "revoke") {
      setPermissionDialogStep(PermissionDialogStep.ConfirmRevoke);
    } else {
      confirmValidateChangePermission();
    }
  };
  const cancelRevoke = () => {
    setPermissionDialogStep(PermissionDialogStep.Permission);
  };
  const selectPermission = (permissionToSelect: Permission | "revoke") => {
    setPermissions(permissionToSelect);
  };
  const onDialogDismiss = () => {
    setPermissionDialogStep(PermissionDialogStep.Permission);
    onDismiss();
  };
  return (
    <PermissionDialog
      isOpen={isOpen}
      loading={permissionDialogLoading}
      onCancelRevoke={cancelRevoke}
      onConfirmRevoke={confirmValidateChangePermission}
      onDismiss={onDialogDismiss}
      onSelectPermission={selectPermission}
      onValidatePermission={validateChangePermission}
      permission={permission}
      recipient={recipient}
      step={permissionDialogStep}
    />
  );
};
