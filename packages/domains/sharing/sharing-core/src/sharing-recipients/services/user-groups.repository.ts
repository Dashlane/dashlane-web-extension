import { Observable } from "rxjs";
import { SharingUserGroup } from "@dashlane/sharing-contracts";
export abstract class SharingUserGroupsRepository {
  abstract getUserGroup(id: string): Promise<SharingUserGroup | null>;
  abstract getUserGroupsForIds(ids: string[]): Promise<SharingUserGroup[]>;
  abstract getUserGroupForId(id: string): Promise<SharingUserGroup>;
  abstract getUserGroups(): Promise<Record<string, SharingUserGroup>>;
  abstract setUserGroups(userGroups: SharingUserGroup[]): void;
  abstract acceptedUserGroupIdsForLogin$(login: string): Observable<string[]>;
}
