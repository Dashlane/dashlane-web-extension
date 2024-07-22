import { CollectionsQueryResult } from "@dashlane/vault-contracts";
import { mapSuccessObservable, Result } from "@dashlane/framework-types";
import {
  Collection as CarbonCollection,
  CarbonLegacyClient,
} from "@dashlane/communication";
import { Observable } from "rxjs";
export const isCarbonCollectionArray = (
  x: unknown
): x is CarbonCollection[] => {
  if (!Array.isArray(x)) {
    return false;
  }
  if (x.length === 0) {
    return true;
  }
  return x.every((item) => {
    const collection = item as Partial<CarbonCollection>;
    return (
      typeof collection.Id === "string" &&
      typeof collection.Name === "string" &&
      Array.isArray(collection.VaultItems)
    );
  });
};
export function fetchCollections(
  carbonLegacyClient: CarbonLegacyClient,
  ids?: string[]
): Observable<Result<CollectionsQueryResult>> {
  const {
    queries: { carbonState },
  } = carbonLegacyClient;
  return carbonState({
    path: `userSession.personalData.collections`,
  }).pipe(
    mapSuccessObservable((x: unknown) => {
      if (!isCarbonCollectionArray(x)) {
        throw new Error("Collection array has a wrong format");
      }
      const filteredCarbonCollections =
        ids && ids.length > 0
          ? x.filter((carbonCollection) => ids.includes(carbonCollection.Id))
          : x;
      return {
        collections: filteredCarbonCollections.map((carbonCollection) => {
          return {
            id: carbonCollection.Id,
            name: carbonCollection.Name,
            spaceId: carbonCollection.SpaceId ?? "",
            vaultItems: carbonCollection.VaultItems.map(
              (carbonCollectionVaultItem) => {
                return {
                  id: carbonCollectionVaultItem.Id,
                  type: carbonCollectionVaultItem.Type,
                };
              }
            ),
          };
        }),
      };
    })
  );
}
