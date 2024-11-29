import { useState } from "react";
import { LoadingIcon } from "@dashlane/ui-components";
import { DataStatus, useModuleCommands } from "@dashlane/framework-react";
import {
  Permission,
  RecipientType,
  RecipientTypes,
  SharedAccessMember,
  sharingCollectionsApi,
  sharingItemsApi,
} from "@dashlane/sharing-contracts";
import { isSuccess } from "@dashlane/framework-types";
import useTranslate from "../../libs/i18n/useTranslate";
import { PermissionDialog } from "./permission-dialog";
import { PermissionDialogStep } from "./types";
import { SharedAccessRecipient } from "./shared-access-recipient";
import { useSharedAccessData } from "./hooks/use-shared-access-data";
import { ContentCard } from "../panel/standard/content-card";
import { memberToRecipient } from "./helpers";
export interface SharedAccessProps {
  id: string;
  isAdmin: boolean;
}
type MemberPermissionPlusRevoke = Permission | "revoke";
export interface DialogState {
  permission: MemberPermissionPlusRevoke;
  recipient: SharedAccessMember;
  recipientType?: RecipientType;
  step: PermissionDialogStep;
}
const I18N_KEYS = {
  COLLECTIONS: "webapp_shared_access_collections",
  GROUPS: "webapp_shared_access_groups_card_title",
  INDIVIDUALS: "webapp_shared_access_individuals_card_title",
};
export const SharedAccess = ({ id, isAdmin }: SharedAccessProps) => {
  const { translate } = useTranslate();
  const [isDialogLoading, setIsDialogLoading] = useState<boolean>(false);
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [selectedUser, setSelectedUser] = useState<string | undefined>(
    undefined
  );
  const { data, status } = useSharedAccessData(id);
  const { updatePermissionForCollectionItem, removeItemFromCollections } =
    useModuleCommands(sharingCollectionsApi);
  const { revokeSharedItem, updateSharedItemPermission } =
    useModuleCommands(sharingItemsApi);
  if (status !== DataStatus.Success) {
    return (
      <LoadingIcon
        color="ds.container.expressive.brand.catchy.idle"
        size={50}
        sx={{ alignSelf: "center", m: "20px" }}
      />
    );
  }
  if (!data) {
    return null;
  }
  const { users, groups, collections } = data;
  const onRevokeAccess = async (
    recipient: SharedAccessMember,
    recipientType?: RecipientType
  ): Promise<boolean> => {
    try {
      if (recipientType === RecipientTypes.Collection) {
        const result = await removeItemFromCollections({
          collectionIds: [recipient.recipientId],
          itemId: id,
        });
        if (!isSuccess(result)) {
          return false;
        }
        return true;
      }
      const revokeSharedItemCommand = await revokeSharedItem({
        vaultItemId: id,
        recipient: memberToRecipient(recipient),
      });
      return revokeSharedItemCommand.tag === DataStatus.Success;
    } catch (_e) {
      return false;
    }
  };
  const onEditPermission = async (
    recipient: SharedAccessMember,
    permission: Permission,
    recipientType?: RecipientType
  ): Promise<boolean> => {
    try {
      if (recipientType === RecipientTypes.Collection) {
        const result = await updatePermissionForCollectionItem({
          itemId: id,
          collection: {
            collectionId: recipient.recipientId,
            permission: permission as Permission,
          },
        });
        if (!isSuccess(result)) {
          return false;
        }
        return true;
      } else {
        const updateSharedItemPermissionCommand =
          await updateSharedItemPermission({
            vaultItemId: id,
            recipient: memberToRecipient(recipient),
            permission,
          });
        return updateSharedItemPermissionCommand.tag === DataStatus.Success;
      }
    } catch (_e) {
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
    const { recipient, permission, recipientType } = dialog;
    setIsDialogLoading(true);
    const res =
      permission === "revoke"
        ? await onRevokeAccess(recipient, recipientType)
        : await onEditPermission(recipient, permission, recipientType);
    if (res) {
      const step =
        permission === "revoke"
          ? PermissionDialogStep.RevokeSuccess
          : PermissionDialogStep.Success;
      updateDialogStep(step);
    } else {
      updateDialogStep(PermissionDialogStep.Failure);
    }
    setIsDialogLoading(false);
  };
  const validateChangePermission = () => {
    if (dialog?.permission === "revoke") {
      setDialog({
        ...dialog,
        step: PermissionDialogStep.ConfirmRevoke,
      });
    } else {
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
  const openEditPermissionsDialog = (
    recipient: SharedAccessMember,
    permission: MemberPermissionPlusRevoke,
    recipientType?: RecipientType
  ) => {
    const permissionsDialog = {
      recipient,
      recipientType,
      permission,
      originPermission: permission,
      step: PermissionDialogStep.Permission,
      name: recipient.recipientName,
    };
    setDialog(permissionsDialog);
  };
  const selectPermission = (permission: Permission | "revoke") => {
    if (!dialog) {
      return;
    }
    setDialog({ ...dialog, permission });
  };
  const hasGroups = groups?.length > 0;
  const hasCollections = collections?.length > 0;
  const hasUsers = users?.length > 0;
  const isOtherUserAdmin =
    selectedUser &&
    users.find(
      (user) =>
        user.recipientId !== selectedUser &&
        user.permission === Permission.Admin
    );
  const shouldRevokeBeDisabled =
    !isOtherUserAdmin &&
    dialog?.recipient.recipientType === RecipientTypes.User;
  const isCollectionItemPermission = dialog?.recipientType === "collection";
  return (
    <div sx={{ flex: "1", overflowY: "auto" }}>
      <ul sx={{ flex: "1" }}>
        {hasCollections ? (
          <ContentCard
            title={translate(I18N_KEYS.COLLECTIONS)}
            additionalSx={{ marginBottom: "16px" }}
          >
            {collections.map((collection) => (
              <SharedAccessRecipient
                key={collection.recipientId}
                isAdmin={isAdmin}
                member={collection}
                vaultItemId={id}
                openEditPermissionsDialog={openEditPermissionsDialog}
              />
            ))}
          </ContentCard>
        ) : null}
        {hasGroups ? (
          <ContentCard
            title={translate(I18N_KEYS.GROUPS)}
            additionalSx={{ marginBottom: "16px" }}
          >
            {groups.map((group) => (
              <SharedAccessRecipient
                key={group.recipientId}
                isAdmin={isAdmin}
                member={group}
                vaultItemId={id}
                openEditPermissionsDialog={openEditPermissionsDialog}
              />
            ))}
          </ContentCard>
        ) : null}
        {hasUsers ? (
          <ContentCard title={translate(I18N_KEYS.INDIVIDUALS)}>
            {users.map((user) => (
              <SharedAccessRecipient
                key={user.recipientId}
                isAdmin={isAdmin}
                member={user}
                onUserSelected={(userId) => setSelectedUser(userId)}
                vaultItemId={id}
                openEditPermissionsDialog={openEditPermissionsDialog}
              />
            ))}
          </ContentCard>
        ) : null}
      </ul>
      {dialog && (
        <PermissionDialog
          isOpen
          isCollectionItemPermission={isCollectionItemPermission}
          shouldRevokeBeDisabled={shouldRevokeBeDisabled || undefined}
          loading={isDialogLoading}
          onCancelRevoke={cancelRevoke}
          onConfirmRevoke={confirmValidateChangePermission}
          onDismiss={() => setDialog(null)}
          onSelectPermission={selectPermission}
          onValidatePermission={validateChangePermission}
          permission={dialog.permission}
          recipient={dialog.recipient}
          step={dialog.step}
        />
      )}
    </div>
  );
};
