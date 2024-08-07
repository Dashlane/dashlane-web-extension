import { combineLatest, switchMap } from "rxjs";
import {
  IQueryHandler,
  QueryHandler,
  QueryHandlerResponseOf,
} from "@dashlane/framework-application";
import { isFailure, mapSuccessObservable } from "@dashlane/framework-types";
import { SharingCollectionsClient } from "@dashlane/sharing-contracts";
import {
  Collection,
  VaultItem,
  VaultItemType,
  VaultOrganizationClient,
  VaultSearchQuery,
} from "@dashlane/vault-contracts";
import { VaultRepository } from "../../../vault-repository";
@QueryHandler(VaultSearchQuery)
export class VaultSearchQueryHandler
  implements IQueryHandler<VaultSearchQuery>
{
  private readonly separator = ",";
  private collections: Collection[] = [];
  private searchQuery = "";
  constructor(
    private vaultRepository: VaultRepository,
    private vaultOrganizationClient: VaultOrganizationClient,
    private sharingCollectionsClient: SharingCollectionsClient
  ) {}
  public execute({
    body,
  }: VaultSearchQuery): QueryHandlerResponseOf<VaultSearchQuery> {
    const { vaultItemTypes, searchQuery, ...params } = body;
    this.searchQuery = searchQuery;
    const {
      queries: { queryCollections },
    } = this.vaultOrganizationClient;
    const {
      queries: { sharedCollectionsWithItems },
    } = this.sharingCollectionsClient;
    return combineLatest([
      queryCollections({}),
      sharedCollectionsWithItems(),
    ]).pipe(
      switchMap(([privateCollectionsResult, sharedCollectionsResult]) => {
        if (
          isFailure(privateCollectionsResult) ||
          isFailure(sharedCollectionsResult)
        ) {
          throw new Error("Error querying collections");
        }
        this.collections = privateCollectionsResult.data.collections.concat(
          sharedCollectionsResult.data
        );
        if (vaultItemTypes) {
          return this.vaultRepository.fetchVaultItems$(
            { vaultItemTypes, ...params },
            this.isVaultItemMatch
          );
        }
        return this.vaultRepository.fetchVaultItems$(
          { vaultItemTypes: Object.values(VaultItemType), ...params },
          this.isVaultItemMatch
        );
      }),
      mapSuccessObservable((items) => {
        let collectionsResult;
        if (!vaultItemTypes) {
          const matchingCollections = this.collections.filter((collection) =>
            this.isMatch(collection)
          );
          collectionsResult = {
            items: matchingCollections,
            matchCount: matchingCollections.length,
          };
        } else {
          collectionsResult = {
            items: [],
            matchCount: 0,
          };
        }
        return {
          ...items,
          collectionsResult,
        };
      })
    );
  }
  private normalizeString = (str: string) =>
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  private isMatch(object: object, searchString = "") {
    searchString += Object.values(object)
      .filter((value) => typeof value !== "object")
      .join(this.separator);
    return this.normalizeString(searchString).includes(
      this.normalizeString(this.searchQuery)
    );
  }
  private isVaultItemMatch = (item: VaultItem) => {
    let searchString = "";
    this.collections.forEach((collection) => {
      if (collection.vaultItems.some((vaultItem) => vaultItem.id === item.id)) {
        searchString += `${collection.name}${this.separator}`;
      }
    });
    return this.isMatch(item, searchString);
  };
}