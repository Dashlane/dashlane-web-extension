import { firstValueFrom, from, switchMap } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { FeatureFlipsClient } from "@dashlane/framework-contracts";
import { getSuccess, isFailure } from "@dashlane/framework-types";
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
  public async getSharedItemsIndex() {
    return (await this.getRepo()).getSharedItemsIndex();
  }
  private async getRepo() {
    const { userFeatureFlip } = this.featureFlips.queries;
    const result = await firstValueFrom(
      userFeatureFlip({
        featureFlip: "sharingVault_web_sharingSyncGrapheneMigration_dev",
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
  public async setSharedItems(sharedItems: SharedItemWithRevision[]) {
    return (await this.getRepo()).setSharedItems(sharedItems);
  }
}
