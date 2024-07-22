import { SharingUserGroup } from "@dashlane/sharing-contracts";
export abstract class SharingUserGroupsRepository {
  abstract getUserGroup(id: string): Promise<SharingUserGroup | null>;
  abstract getUserGroupsForIds(ids: string[]): Promise<SharingUserGroup[]>;
  abstract getUserGroups(): Promise<Record<string, SharingUserGroup>>;
  abstract setUserGroups(userGroups: SharingUserGroup[]): void;
}
