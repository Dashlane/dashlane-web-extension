import { map } from "rxjs";
import { SharingUserGroup, Status } from "@dashlane/sharing-contracts";
import {
  FrameworkRequestContextValues,
  Injectable,
  RequestContext,
} from "@dashlane/framework-application";
import { SharingUserGroupsRepository } from "../services/user-groups.repository";
import { UserGroupsGetterService } from "../../sharing-carbon-helpers";
@Injectable()
export class SharingUserGroupsRepositoryLegacyAdapter
  implements SharingUserGroupsRepository
{
  public constructor(
    private context: RequestContext,
    private userGroupsGetter: UserGroupsGetterService
  ) {}
  private getCurrentUserLogin(): string | undefined {
    return this.context.get<string>(FrameworkRequestContextValues.UserName);
  }
  public async getUserGroups() {
    const userGroups = await this.userGroupsGetter.getCarbonUserGroups();
    const userGroupsRecord: Record<string, SharingUserGroup> = {};
    const currentUserLogin = this.getCurrentUserLogin();
    userGroups.forEach((userGroup) => {
      const { groupId, name, revision, privateKey, publicKey, users } =
        userGroup;
      const groupKey =
        users.find((user) => user.userId === currentUserLogin)?.groupKey ?? "";
      const acceptedUsers = users.reduce((acc: string[], user) => {
        if (user.status === Status.Accepted) {
          acc.push(user.userId);
        }
        return acc;
      }, []);
      userGroupsRecord[userGroup.groupId] = {
        acceptedUsers,
        groupId,
        name,
        revision,
        privateKey,
        publicKey,
        users,
        groupKey,
      };
    });
    return userGroupsRecord;
  }
  public setUserGroups() {
    throw new Error(
      "Setting the user group index is not supported in the legacy user groups repository adapter"
    );
  }
  async getUserGroup(id: string) {
    const userGroup = await this.userGroupsGetter.getCarbonUserGroupForGroupId(
      id
    );
    if (!userGroup) {
      throw new Error("Getting a user group by id failed");
    }
    const currentUserLogin = this.getCurrentUserLogin();
    const groupKey =
      userGroup.users.find((user) => user.userId === currentUserLogin)
        ?.groupKey ?? "";
    return { ...userGroup, groupKey };
  }
  async getUserGroupsForIds(ids: string[]) {
    const currentUserLogin = this.getCurrentUserLogin();
    const userGroupsWithoutGroupKeys =
      await this.userGroupsGetter.getCarbonUserGroupForGroupIds(ids);
    const userGroups = userGroupsWithoutGroupKeys.map((userGroup) => {
      const groupKey =
        userGroup.users.find((user) => user.userId === currentUserLogin)
          ?.groupKey ?? "";
      return { ...userGroup, groupKey };
    });
    return userGroups;
  }
  async getUserGroupForId(id: string) {
    const userGroup = await this.userGroupsGetter.getCarbonUserGroupForGroupId(
      id
    );
    if (!userGroup) {
      throw new Error(`Failed to retrieve user group by id`);
    }
    const currentUserLogin = this.getCurrentUserLogin();
    const groupKey =
      userGroup.users.find((user) => user.userId === currentUserLogin)
        ?.groupKey ?? "";
    return { ...userGroup, groupKey };
  }
  acceptedUserGroupIdsForLogin$(login: string) {
    return this.userGroupsGetter.getCarbonUserGroups$().pipe(
      map((userGroups) => {
        return userGroups
          .filter((group) =>
            group.users.some(
              (user) => user.userId === login && user.status === Status.Accepted
            )
          )
          .map((group) => group.groupId);
      })
    );
  }
}
