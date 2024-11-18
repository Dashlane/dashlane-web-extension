import { firstValueFrom, from, switchMap } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { getSuccess, isFailure } from "@dashlane/framework-types";
import { FeatureFlipsClient } from "@dashlane/framework-contracts";
import {
  SharingSyncFeatureFlips,
  SharingUserGroup,
} from "@dashlane/sharing-contracts";
import { SharingUserGroupsRepository } from "../services/user-groups.repository";
import { SharingUserGroupsRepositoryAdapter } from "./user-groups-repository.adapter";
import { SharingUserGroupsRepositoryLegacyAdapter } from "./user-groups-repository-legacy.adapter";
@Injectable()
export class SharingUserGroupsRepositoryWrapper
  implements SharingUserGroupsRepository
{
  public constructor(
    private readonly repo: SharingUserGroupsRepositoryAdapter,
    private readonly legacyRepo: SharingUserGroupsRepositoryLegacyAdapter,
    private readonly featureFlips: FeatureFlipsClient
  ) {}
  public async getUserGroup(id: string) {
    return (await this.getRepo()).getUserGroup(id);
  }
  public async getUserGroupsForIds(ids: string[]) {
    return (await this.getRepo()).getUserGroupsForIds(ids);
  }
  public async getUserGroupForId(id: string) {
    return (await this.getRepo()).getUserGroupForId(id);
  }
  public async getUserGroups() {
    return (await this.getRepo()).getUserGroups();
  }
  public async setUserGroups(userGroups: SharingUserGroup[]) {
    return (await this.getRepo()).setUserGroups(userGroups);
  }
  public acceptedUserGroupIdsForLogin$(login: string) {
    return from(this.getRepo()).pipe(
      switchMap((repo) => repo.acceptedUserGroupIdsForLogin$(login))
    );
  }
  private async getRepo() {
    const { userFeatureFlip } = this.featureFlips.queries;
    const result = await firstValueFrom(
      userFeatureFlip({
        featureFlip: SharingSyncFeatureFlips.SharingSyncGrapheneMigrationDev,
      })
    );
    if (isFailure(result)) {
      return this.legacyRepo;
    }
    return getSuccess(result) ? this.repo : this.legacyRepo;
  }
}
