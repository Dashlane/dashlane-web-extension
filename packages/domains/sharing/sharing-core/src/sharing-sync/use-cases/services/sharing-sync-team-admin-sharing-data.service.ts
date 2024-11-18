import { equals } from "ramda";
import { Injectable } from "@dashlane/framework-application";
import { safeCast } from "@dashlane/framework-types";
import {
  ItemContent,
  ItemGroupDownload,
  UserGroupDownload,
} from "@dashlane/server-sdk/v1";
import {
  RevisionSummary,
  SharingUserGroup,
  SpecialItemGroupDownload,
  SpecialUserGroupDownload,
  TeamAdminSharingData,
  TimestampSummary,
} from "@dashlane/sharing-contracts";
import { CurrentUserWithKeyPair } from "../../../sharing-carbon-helpers";
import { SharingSyncValidationService } from "./sharing-sync-validation.service";
import { TeamAdminSharingDataStore } from "../../store/team-admin-sharing-data.store";
import { crawlForAccessData } from "../../../utils/mappers/crawl-shared-item-access-data";
interface TeamAdminSharingDataUpdates {
  userGroupId?: string;
  itemGroupId?: string;
  itemIds?: string[];
}
const mapToSharingUserGroup = (
  userGroup: SpecialUserGroupDownload,
  currentUserId: string
): SharingUserGroup => {
  const { groupId, name, revision, users, privateKey, publicKey } = userGroup;
  const groupKey =
    users.find((user) => user.userId === currentUserId)?.groupKey ?? undefined;
  return {
    groupId,
    name,
    revision,
    publicKey,
    privateKey,
    groupKey,
    users: [],
  };
};
@Injectable()
export class SharingSyncTeamAdminSharingDataService {
  public constructor(
    private readonly store: TeamAdminSharingDataStore,
    private readonly validationService: SharingSyncValidationService
  ) {}
  public async getTeamAdminSharingDataSummary(
    userGroups: RevisionSummary[],
    itemGroups: RevisionSummary[],
    items: TimestampSummary[]
  ) {
    const { specialItemGroup, specialItems, specialUserGroup } =
      await this.store.getState();
    if (!specialUserGroup) {
      return;
    }
    const specialUserGroupRevision = userGroups.find(
      ({ revision, id }) =>
        specialUserGroup.groupId === id &&
        specialUserGroup.revision === revision
    );
    const specialItemGroupRevision = specialItemGroup
      ? itemGroups.find(
          ({ revision, id }) =>
            specialItemGroup.groupId === id &&
            specialItemGroup.revision === revision
        )
      : undefined;
    const specialItemRevisions = specialItems
      ? items.filter(({ id, timestamp }) => {
          const specialItem = specialItems[id];
          return specialItem?.timestamp === timestamp;
        })
      : undefined;
    return {
      itemGroupId: specialItemGroupRevision?.id,
      userGroupId: specialUserGroupRevision?.id,
      itemIds: specialItemRevisions?.map(({ id }) => id),
    };
  }
  public async syncTeamAdminSharingData(
    teamAdminSharingDataUpdates: TeamAdminSharingDataUpdates | undefined,
    updatedUserGroups: UserGroupDownload[] | undefined,
    updatedItemGroups: ItemGroupDownload[] | undefined,
    updatedItems: ItemContent[] | undefined,
    currentUser: CurrentUserWithKeyPair
  ) {
    const currentState = await this.store.getState();
    const newState: TeamAdminSharingData = {
      specialUserGroup: teamAdminSharingDataUpdates?.userGroupId
        ? currentState.specialUserGroup
        : undefined,
      specialItemGroup: teamAdminSharingDataUpdates?.itemGroupId
        ? currentState.specialItemGroup
        : undefined,
      specialItems: teamAdminSharingDataUpdates?.itemIds?.reduce((acc, id) => {
        const item = currentState.specialItems?.[id];
        if (item) {
          acc[id] = item;
        }
        return acc;
      }, safeCast<Record<string, ItemContent>>({})),
    };
    const specialUserGroup = updatedUserGroups?.find(
      (group) => group.type === "teamAdmins"
    );
    if (specialUserGroup) {
      const isValid = await this.validationService.isUserGroupValid(
        specialUserGroup,
        currentUser
      );
      if (isValid) {
        newState.specialUserGroup =
          specialUserGroup as SpecialUserGroupDownload;
      } else {
        this.store.set({});
        return;
      }
    }
    const specialItemGroup = updatedItemGroups?.find(
      (group) => group.type === "userGroupKeys"
    );
    if (specialItemGroup && newState.specialUserGroup) {
      const accessData = crawlForAccessData(
        specialItemGroup,
        currentUser.login,
        [mapToSharingUserGroup(newState.specialUserGroup, currentUser.login)],
        []
      );
      const isItemGroupValid =
        await this.validationService.isSharedItemAccessValid(
          specialItemGroup.groupId,
          accessData?.link,
          currentUser
        );
      if (isItemGroupValid.isValid) {
        newState.specialItemGroup =
          specialItemGroup as SpecialItemGroupDownload;
      } else {
        this.store.set({});
        return;
      }
    }
    if (newState.specialItemGroup?.items) {
      updatedItems?.forEach((updatedSpecialItem) => {
        const specialItem = newState.specialItemGroup?.items?.find(
          (item) => item.itemId === updatedSpecialItem.itemId
        );
        if (specialItem) {
          if (!newState.specialItems) {
            newState.specialItems = {};
          }
          newState.specialItems[updatedSpecialItem.itemId] = updatedSpecialItem;
        }
      });
    }
    if (!equals(newState, currentState)) {
      this.store.set(newState);
    }
  }
}
