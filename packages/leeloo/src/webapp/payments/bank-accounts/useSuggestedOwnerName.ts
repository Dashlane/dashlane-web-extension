import { useModuleQuery } from "@dashlane/framework-react";
import {
  Identity,
  SortDirection,
  vaultItemsCrudApi,
  VaultItemType,
} from "@dashlane/vault-contracts";
const getName = (identities: Identity[]): string => {
  const { firstName, lastName } = identities
    .filter(Boolean)
    .find(
      (item) => item.firstName.trim() !== "" || item.lastName.trim() !== ""
    ) ?? { firstName: "", lastName: "" };
  return [firstName, lastName].join(" ").trim();
};
export const useSuggestedOwnerName = (spaceId: string | null): string => {
  const { data } = useModuleQuery(vaultItemsCrudApi, "query", {
    vaultItemTypes: [VaultItemType.Identity],
    propertyFilters:
      spaceId !== null
        ? [
            {
              property: "spaceId",
              value: spaceId,
            },
          ]
        : undefined,
    propertySorting: {
      property: "lastUse",
      direction: SortDirection.Descend,
    },
  });
  if (!data || !data.identitiesResult.matchCount) {
    return "";
  }
  return getName(data.identitiesResult.items);
};
