import { defineModuleApi } from "@dashlane/framework-contracts";
import {
  GetCollectionPermissionsForUserQuery,
  GetCollectionRoleForGroupQuery,
  GetCollectionsForUserOrGroupQuery,
  GetItemIdsInSharedCollectionsQuery,
  GetSharedCollectionsCountQuery,
  GetSharedCollectionsQuery,
  SharedCollectionsWithItemsQuery,
  UsersAndGroupsInCollectionQuery,
} from "./queries";
import {
  AddItemsToCollectionsCommand,
  CreateSharedCollectionCommand,
  DeleteSharedCollectionCommand,
  InviteCollectionMembersCommand,
  MoveCollectionItemsToBusinessSpaceCommand,
  RemoveItemFromCollectionsCommand,
  RenameCollectionCommand,
  RevokeCollectionMembersCommand,
  UpdateCollectionMembersCommand,
  UpdatePermissionForCollectionItemCommand,
  UpdateSharedCollectionsCommand,
} from "./commands";
export const sharingCollectionsApi = defineModuleApi({
  name: "sharingCollections" as const,
  commands: {
    addItemsToCollections: AddItemsToCollectionsCommand,
    createSharedCollection: CreateSharedCollectionCommand,
    deleteSharedCollection: DeleteSharedCollectionCommand,
    inviteCollectionMembers: InviteCollectionMembersCommand,
    updateCollectionMembers: UpdateCollectionMembersCommand,
    removeItemFromCollections: RemoveItemFromCollectionsCommand,
    renameCollection: RenameCollectionCommand,
    revokeCollectionMembers: RevokeCollectionMembersCommand,
    updateSharedCollections: UpdateSharedCollectionsCommand,
    updatePermissionForCollectionItem: UpdatePermissionForCollectionItemCommand,
    moveCollectionItemsToBusinessSpace:
      MoveCollectionItemsToBusinessSpaceCommand,
  },
  events: {},
  queries: {
    getCollectionsForUserOrGroup: GetCollectionsForUserOrGroupQuery,
    getItemIdsInSharedCollections: GetItemIdsInSharedCollectionsQuery,
    getSharedCollections: GetSharedCollectionsQuery,
    getCollectionPermissionsForUser: GetCollectionPermissionsForUserQuery,
    getCollectionRoleForGroup: GetCollectionRoleForGroupQuery,
    getSharedCollectionsCount: GetSharedCollectionsCountQuery,
    sharedCollectionsWithItems: SharedCollectionsWithItemsQuery,
    usersAndGroupsInCollection: UsersAndGroupsInCollectionQuery,
  },
});
