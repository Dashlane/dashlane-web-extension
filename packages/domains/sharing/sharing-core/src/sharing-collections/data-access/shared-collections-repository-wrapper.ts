import { firstValueFrom, from, Observable, switchMap } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { FeatureFlipsClient } from "@dashlane/framework-contracts";
import { SharedCollection } from "@dashlane/sharing-contracts";
import { getSuccess, isFailure } from "@dashlane/framework-types";
import { SharedCollectionsRepository } from "../handlers/common/shared-collections.repository";
import { SharedCollectionsRepositoryLegacyAdapter } from "./shared-collections-repository-legacy.adapter";
import { SharedCollectionsRepositoryAdapter } from "./shared-collections-repository.adapter";
@Injectable()
export class SharedCollectionsRepositoryWrapper
  implements SharedCollectionsRepository
{
  public constructor(
    private legacyRepo: SharedCollectionsRepositoryLegacyAdapter,
    private repo: SharedCollectionsRepositoryAdapter,
    private featureFlips: FeatureFlipsClient
  ) {}
  public async getCollectionsByIds(ids: string[]): Promise<SharedCollection[]> {
    return (await this.getRepo()).getCollectionsByIds(ids);
  }
  public async getCollections() {
    return (await this.getRepo()).getCollections();
  }
  public collections$(): Observable<SharedCollection[]> {
    return from(this.getRepo()).pipe(switchMap((repo) => repo.collections$()));
  }
  public collection$(id: string): Observable<SharedCollection | undefined> {
    return from(this.getRepo()).pipe(switchMap((repo) => repo.collection$(id)));
  }
  public async getCollection(id: string) {
    return (await this.getRepo()).getCollection(id);
  }
  public async updateCollections(collections: SharedCollection[]) {
    return (await this.getRepo()).updateCollections(collections);
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
}
