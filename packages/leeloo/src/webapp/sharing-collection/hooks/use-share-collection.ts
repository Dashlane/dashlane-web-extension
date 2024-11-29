import { useCallback } from "react";
import { useToast } from "@dashlane/design-system";
import { useEventWrapper, useModuleCommands } from "@dashlane/framework-react";
import {
  Origin,
  SharingFlowType,
  UserSharingOutcomeEvent,
} from "@dashlane/hermes";
import { isFailure } from "@dashlane/framework-types";
import {
  ATTACHMENT_IN_COLLECTION,
  Permission,
  SharedCollectionRole,
  SharedCollectionUserGroupRecipient,
  SharedCollectionUserRecipient,
  sharingCollectionsApi,
} from "@dashlane/sharing-contracts";
import { VaultItemType } from "@dashlane/vault-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logEvent } from "../../../libs/logs/logEvent";
import { CollectionSharingRoles } from "../sharing-collection-recipients";
import { useCollectionsContext } from "../../collections/collections-context";
import { SharingInviteStep } from "../../sharing-invite/types";
const I18N_KEYS = {
  COLLECTION_SHARE_SUCCESS:
    "webapp_sharing_invite_collection_share_success_message",
  COLLECTION_SHARE_ERROR: "webapp_sharing_invite_collection_share_error",
  COLLECTION_SHARE_ATTACHMENTS_ERROR:
    "secure_note_attachments_in_collection_error",
};
interface UseShareCollectionParams {
  selectedGroups: string[];
  selectedUsers: string[];
  selectedCollectionId: string;
  itemPermissions: Permission;
  roles: CollectionSharingRoles[];
  setIsLoading: (value: boolean) => void;
  origin: Origin;
  onDismiss: () => void;
  goToStep: (step: SharingInviteStep) => void;
}
export const useShareCollection = ({
  selectedCollectionId,
  selectedUsers,
  selectedGroups,
  itemPermissions,
  roles,
  setIsLoading,
  origin,
  onDismiss,
  goToStep,
}: UseShareCollectionParams) => {
  const eventWrapper = useEventWrapper();
  const { translate } = useTranslate();
  const { collections, sharedCollections } = useCollectionsContext();
  const toast = useToast();
  const { createSharedCollection, inviteCollectionMembers } = useModuleCommands(
    sharingCollectionsApi
  );
  const shareCollection = useCallback(() => {
    const mapToUserRecipient = (id: string): SharedCollectionUserRecipient => {
      const foundRole = roles.find((role) => role.id === id);
      return {
        login: id,
        role: foundRole ? foundRole.role : SharedCollectionRole.Manager,
      };
    };
    const mapToUserGroupRecipient = (
      id: string
    ): SharedCollectionUserGroupRecipient => {
      const foundRole = roles.find((role) => role.id === id);
      return {
        groupId: id,
        role: foundRole ? foundRole.role : SharedCollectionRole.Manager,
      };
    };
    const errorHandler = (errorTag?: string) => {
      setIsLoading(false);
      onDismiss();
      let description = translate(I18N_KEYS.COLLECTION_SHARE_ERROR);
      if (errorTag === ATTACHMENT_IN_COLLECTION) {
        description = translate(I18N_KEYS.COLLECTION_SHARE_ATTACHMENTS_ERROR);
      }
      toast.showToast({
        description,
        mood: "danger",
      });
      logEvent(
        new UserSharingOutcomeEvent({
          sharingFlowType: SharingFlowType.CollectionSharing,
          isSuccessful: false,
          origin: origin,
        })
      );
    };
    const shareCollectionHandler = async () => {
      setIsLoading(true);
      const privateCollection = collections.find(
        (collection) =>
          collection.spaceId && collection.id === selectedCollectionId
      );
      const sharedCollection = sharedCollections.find(
        (collection) => collection.id === selectedCollectionId
      );
      let result;
      if (privateCollection) {
        const itemIds = privateCollection.vaultItems.reduce(
          (acc: string[], curr) => {
            if (
              curr.type === VaultItemType.Credential ||
              curr.type === VaultItemType.SecureNote
            ) {
              acc.push(curr.id);
            }
            return acc;
          },
          []
        );
        result = await createSharedCollection({
          collectionName: privateCollection.name,
          privateCollectionId: privateCollection.id,
          teamId: privateCollection.spaceId,
          users: selectedUsers.map(mapToUserRecipient),
          groups: selectedGroups.map(mapToUserGroupRecipient),
          itemIds,
          defaultItemPermissions: itemPermissions,
        });
      } else if (sharedCollection) {
        result = await inviteCollectionMembers({
          collectionId: sharedCollection.id,
          userRecipients: selectedUsers.map(mapToUserRecipient),
          userGroupRecipients: selectedGroups.map(mapToUserGroupRecipient),
        });
      } else {
        errorHandler();
        return;
      }
      if (isFailure(result)) {
        errorHandler(result?.error?.tag);
        return;
      }
      setIsLoading(false);
      toast.showToast({
        description: translate(I18N_KEYS.COLLECTION_SHARE_SUCCESS, {
          collectionName: privateCollection?.name ?? sharedCollection?.name,
        }),
      });
      logEvent(
        new UserSharingOutcomeEvent({
          sharingFlowType: SharingFlowType.CollectionSharing,
          isSuccessful: true,
          origin: origin,
        })
      );
      goToStep(SharingInviteStep.Success);
      onDismiss();
    };
    eventWrapper.wrap(shareCollectionHandler, errorHandler)();
  }, [
    roles,
    selectedUsers,
    selectedGroups,
    itemPermissions,
    collections,
    sharedCollections,
    selectedCollectionId,
  ]);
  return {
    shareCollection,
  };
};
