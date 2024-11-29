import { useCallback, useState } from "react";
import { Infobox } from "@dashlane/design-system";
import { useEventWrapper, useModuleCommands } from "@dashlane/framework-react";
import {
  Permission,
  RevokeCollectionMembersCommandParam,
  SharedCollectionRole,
  SharedCollectionUserOrGroupView,
  sharingCollectionsApi,
  UpdateCollectionMembersCommandParam,
} from "@dashlane/sharing-contracts";
import { AlertSeverity } from "@dashlane/ui-components";
import { useCollectionPermissionsForUser } from "../../../../sharing-invite/hooks/use-collection-permissions";
import { useCollectionUsersAndGroupsData } from "../../../../../libs/hooks/use-collection-users-and-groups";
import { useAlert } from "../../../../../libs/alert-notifications/use-alert";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { BaseDialog } from "../base-dialog";
import { MemberRow, MemberToConfirmType } from "./member-row";
const I18N_KEYS = {
  COLLECTION_SHARE_ERROR: "webapp_sharing_invite_collection_share_error",
  EDITOR_INFOBOX: "webapp_sharing_collection_access_editor_infobox",
  CONFIRM_DESCRIPTION:
    "webapp_sharing_collection_access_revoke_confirmation_description_markup",
  CONFIRM_TITLE: "webapp_sharing_collection_access_revoke_confirmation_title",
  REVOKE_ACCESS_BUTTON: "webapp_sharing_collection_access_revoke_access_button",
  SHARED_ACCESS_UPDATE_BUTTON: "webapp_sharing_collection_access_update_button",
  SHARED_ACCESS_TITLE: "webapp_sharing_collection_access_dialog_title",
  SUCCESS: "webapp_sharing_collection_access_revoked",
  SHARED_ACCESS_UPDATED: "webapp_collection_shared_access_updated",
  SUCCESS_DETAIL: "webapp_sharing_collection_access_revoked_description_markup",
};
export interface SharedAccessDialogProps {
  id: string;
  onClose: () => void;
  isOpen?: boolean;
}
export const SharedAccessDialog = ({
  id,
  onClose,
  isOpen = true,
}: SharedAccessDialogProps) => {
  const [editorManagerMemberToConfirm, setEditorManagerMemberToConfirm] =
    useState<MemberToConfirmType[]>([]);
  const [memberToConfirm, setMemberToConfirm] = useState<
    | (SharedCollectionUserOrGroupView & {
        isGroup?: boolean;
      })
    | null
  >(null);
  const [isUpdatePending, setIsUpdatePending] = useState(false);
  const eventWrapper = useEventWrapper();
  const { revokeCollectionMembers, updateCollectionMembers } =
    useModuleCommands(sharingCollectionsApi);
  const { showAlert } = useAlert();
  const { translate } = useTranslate();
  const usersAndGroups = useCollectionUsersAndGroupsData([id]);
  const { role, canEditRoles } = useCollectionPermissionsForUser(id);
  const isUserCollectionManager = role === SharedCollectionRole.Manager;
  const groups = usersAndGroups?.userGroups ?? [];
  const users = usersAndGroups?.users ?? [];
  const handleCancel = () => {
    if (memberToConfirm) {
      setMemberToConfirm(null);
    }
    if (editorManagerMemberToConfirm.length) {
      setEditorManagerMemberToConfirm([]);
    } else {
      onClose();
    }
    onClose();
  };
  const handleSharedAccessUpdate = useCallback(
    (isGroup?: boolean) => {
      const errorHandler = () => {
        setIsUpdatePending(false);
        showAlert(
          translate(I18N_KEYS.COLLECTION_SHARE_ERROR),
          AlertSeverity.ERROR
        );
      };
      const permissionToSharedCollectionRole = (role?: Permission) => {
        switch (role) {
          case Permission.Admin:
            return SharedCollectionRole.Manager;
          case Permission.Limited:
            return SharedCollectionRole.Editor;
          default:
            return SharedCollectionRole.Editor;
        }
      };
      const handleRoleUpdate = async () => {
        const groupToUpdate = editorManagerMemberToConfirm.filter(
          (memberItem) => isGroup ?? memberItem.isGroup
        );
        const userToUpdate = editorManagerMemberToConfirm.filter(
          (memberItem) => !memberItem.isGroup ?? !isGroup
        );
        const groupToRevoke = groupToUpdate.filter(
          (groupItem) => !groupItem.permission
        );
        const userToRevoke = userToUpdate.filter(
          (userItem) => !userItem.permission
        );
        if (groupToRevoke.length || userToRevoke.length) {
          const revokePayload: RevokeCollectionMembersCommandParam = {
            collectionId: id,
          };
          if (groupToRevoke.length) {
            revokePayload.userGroupIds = groupToRevoke.map(
              (groupToRemove) => groupToRemove.id
            );
          }
          if (userToRevoke.length) {
            revokePayload.userLogins = userToRevoke.map(
              (userToRemove) => userToRemove.id
            );
          }
          if (revokePayload.userGroupIds || revokePayload.userLogins) {
            await revokeCollectionMembers(revokePayload);
          }
        }
        if (groupToUpdate.length || userToUpdate.length) {
          const collectionMembersPayload: UpdateCollectionMembersCommandParam =
            {
              collectionId: id,
            };
          if (groupToUpdate.length && !groupToRevoke.length) {
            collectionMembersPayload.userGroupRecipients = groupToUpdate.map(
              (group) => {
                return {
                  groupId: group.id,
                  role: permissionToSharedCollectionRole(group.permission),
                };
              }
            );
          }
          if (userToUpdate.length && !userToRevoke.length) {
            collectionMembersPayload.userRecipients = userToUpdate.map(
              (user) => {
                return {
                  login: user.id,
                  role: permissionToSharedCollectionRole(user.permission),
                };
              }
            );
          }
          if (
            collectionMembersPayload.userGroupRecipients ||
            collectionMembersPayload.userRecipients
          ) {
            await updateCollectionMembers(collectionMembersPayload);
          }
        }
        setIsUpdatePending(false);
        showAlert(
          translate(I18N_KEYS.SHARED_ACCESS_UPDATED),
          AlertSeverity.SUCCESS
        );
        setEditorManagerMemberToConfirm([]);
        onClose();
      };
      eventWrapper.wrap(handleRoleUpdate, errorHandler)();
    },
    [eventWrapper, editorManagerMemberToConfirm, id]
  );
  const onlyOneGroupMemberLeft = groups.length === 1 && users.length === 0;
  return (
    <BaseDialog
      title={translate(I18N_KEYS.SHARED_ACCESS_TITLE)}
      shouldShowCancelButton={editorManagerMemberToConfirm !== null}
      isScrollingDisabled={false}
      confirmAction={{
        onClick: () => handleSharedAccessUpdate(),
        isLoading: isUpdatePending,
        disabled: !editorManagerMemberToConfirm.length,
        children: translate(I18N_KEYS.SHARED_ACCESS_UPDATE_BUTTON),
      }}
      content={
        <div
          sx={{
            marginBottom: "40px",
          }}
        >
          {!isUserCollectionManager && (
            <Infobox mood="brand" title={translate(I18N_KEYS.EDITOR_INFOBOX)} />
          )}
          {groups.map((group: SharedCollectionUserOrGroupView) => (
            <MemberRow
              isGroup
              isLastGroupMember={onlyOneGroupMemberLeft}
              isUpdatePending={isUpdatePending}
              key={group.id}
              member={group}
              memberToConfirm={editorManagerMemberToConfirm}
              isUserCollectionManager={isUserCollectionManager}
              canEditRoles={canEditRoles}
              setEditorManagerMemberToConfirm={setEditorManagerMemberToConfirm}
            />
          ))}
          {groups.length > 0 && (
            <div
              sx={{
                width: "100%",
                borderBottom: "1px solid ds.border.neutral.quiet.idle",
              }}
            />
          )}
          {users.map((user: SharedCollectionUserOrGroupView) => (
            <MemberRow
              isUpdatePending={isUpdatePending}
              key={user.id}
              member={user}
              memberToConfirm={editorManagerMemberToConfirm}
              isUserCollectionManager={isUserCollectionManager}
              canEditRoles={canEditRoles}
              setEditorManagerMemberToConfirm={setEditorManagerMemberToConfirm}
            />
          ))}
        </div>
      }
      onClose={handleCancel}
      isOpen={isOpen}
    />
  );
};
