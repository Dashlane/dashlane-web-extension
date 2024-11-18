import { firstValueFrom, from, switchMap } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { FeatureFlipsClient } from "@dashlane/framework-contracts";
import { getSuccess, isFailure } from "@dashlane/framework-types";
import {
  SharedAccess,
  SharingSyncFeatureFlips,
} from "@dashlane/sharing-contracts";
import {
  SharedItemsRepository,
  SharedItemWithRevision,
} from "../handlers/common/shared-items-repository";
import { SharedItemsRepositoryAdapter } from "./shared-items-repository.adapter";
import { SharedItemsLegacyRepositoryAdapter } from "./shared-items-repository-legacy.adapter";
@Injectable()
export class SharedItemsRepositoryWrapper implements SharedItemsRepository {
  public constructor(
    private readonly repo: SharedItemsRepositoryAdapter,
    private readonly legacyRepo: SharedItemsLegacyRepositoryAdapter,
    private readonly featureFlips: FeatureFlipsClient
  ) {}
  public sharedItems$() {
    return from(this.getRepo()).pipe(switchMap((repo) => repo.sharedItems$()));
  }
  public sharedItemForId$(itemId: string) {
    return from(this.getRepo()).pipe(
      switchMap((repo) => repo.sharedItemForId$(itemId))
    );
  }
  public sharedItemsForIds$(itemIds: string[]) {
    return from(this.getRepo()).pipe(
      switchMap((repo) => repo.sharedItemsForIds$(itemIds))
    );
  }
  public sharedAccess$() {
    return from(this.getRepo()).pipe(switchMap((repo) => repo.sharedAccess$()));
  }
  public sharedAccessForId$(itemId: string) {
    return from(this.getRepo()).pipe(
      switchMap((repo) => repo.sharedAccessForId$(itemId))
    );
  }
  public sharedAccessForIds$(itemIds: string[]) {
    return from(this.getRepo()).pipe(
      switchMap((repo) => repo.sharedAccessForIds$(itemIds))
    );
  }
  public sharedAccessesById$(itemIds: string[]) {
    return from(this.getRepo()).pipe(
      switchMap((repo) => repo.sharedAccessesById$(itemIds))
    );
  }
  public async getSharedItemsIndex() {
    return (await this.getRepo()).getSharedItemsIndex();
  }
  public async getRepo() {
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
  public async getVaultItemsIndex() {
    return (await this.getRepo()).getVaultItemsIndex();
  }
  public async setSharedItems(
    sharedItems?: SharedItemWithRevision[],
    sharedAccess?: Record<string, SharedAccess>
  ) {
    return (await this.getRepo()).setSharedItems(sharedItems, sharedAccess);
  }
}
