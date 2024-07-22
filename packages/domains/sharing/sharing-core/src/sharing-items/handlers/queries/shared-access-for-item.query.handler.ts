import { map, of, switchMap } from "rxjs";
import { getSuccess, isFailure, success } from "@dashlane/framework-types";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import {
  RecipientTypes,
  SharedAccessForItemQuery,
} from "@dashlane/sharing-contracts";
import {
  ItemGroupsGetterService,
  UserGroupsGetterService,
} from "../../../sharing-carbon-helpers";
import { SharedCollectionsRepository } from "../../../sharing-collections";
@QueryHandler(SharedAccessForItemQuery)
export class SharedAccessForItemQueryHandler
  implements IQueryHandler<SharedAccessForItemQuery>
{
  constructor(
    private itemGroupsGetter: ItemGroupsGetterService,
    private userGroupsGetter: UserGroupsGetterService,
    private collectionsRepository: SharedCollectionsRepository
  ) {}
  execute({ body }: SharedAccessForItemQuery) {
    const { itemId } = body;
    return this.itemGroupsGetter.getForItemId(itemId).pipe(
      map((itemGroupResult) => {
        if (isFailure(itemGroupResult)) {
          throw new Error("Error when retrieving item group for shared access");
        }
        const itemGroup = getSuccess(itemGroupResult);
        if (!itemGroup) {
          return undefined;
        }
        const users = itemGroup.users
          ?.map((user) => ({
            permission: user.permission,
            status: user.status,
            recipientId: user.userId,
            recipientName: user.alias,
            recipientType: RecipientTypes.User,
          }))
          .filter((user) => !["revoked", "refused"].includes(user.status ?? ""))
          .sort((a, b) => a.recipientName.localeCompare(b.recipientName));
        const groups = itemGroup.groups
          ?.map((group) => ({
            permission: group.permission,
            status: group.status,
            recipientId: group.groupId,
            recipientName: group.name,
            recipientType: RecipientTypes.Group,
          }))
          .filter(
            (groupMember) =>
              !["revoked", "refused"].includes(groupMember.status)
          )
          .sort((a, b) => a.recipientName.localeCompare(b.recipientName));
        const collections = itemGroup.collections
          ?.map((collection) => ({
            permission: collection.permission,
            status: collection.status,
            recipientId: collection.uuid,
            recipientName: collection.name,
            recipientType: RecipientTypes.Collection,
          }))
          .filter(
            (collection) => !["revoked", "refused"].includes(collection.status)
          )
          .sort((a, b) => a.recipientName.localeCompare(b.recipientName));
        return {
          users: users ?? [],
          groups: groups ?? [],
          collections: collections ?? [],
          itemGroupId: itemGroup.groupId,
        };
      }),
      switchMap((result) => {
        if (result?.groups.length) {
          return this.userGroupsGetter.getCarbonUserGroups$().pipe(
            map((allUserGroups) => {
              return {
                ...result,
                groups: result.groups.map((group) => ({
                  ...group,
                  recipientName:
                    allUserGroups.find(
                      (userGroup) => userGroup.groupId === group.recipientId
                    )?.name ?? group.recipientName,
                })),
              };
            })
          );
        }
        return of(result);
      }),
      switchMap((result) => {
        if (result?.collections.length) {
          return this.collectionsRepository.collections$().pipe(
            map((allCollections) => {
              return {
                ...result,
                collections: result.collections.map((member) => ({
                  ...member,
                  recipientName:
                    allCollections.find(
                      (collection) => collection.uuid === member.recipientId
                    )?.name ?? member.recipientName,
                })),
              };
            })
          );
        }
        return of(result);
      }),
      map((result) =>
        success(
          result
            ? {
                ...result,
                count:
                  result.users.length +
                  result.groups.length +
                  result.collections.length,
              }
            : undefined
        )
      )
    );
  }
}
