import { DataModelObject, Identity } from "@dashlane/communication";
import {
  FilterOperators,
  VaultItem,
  VaultItemPropertyFilter,
} from "@dashlane/vault-contracts";
import { isKeyInItem } from "./utility";
function compareProperties<T>(
  itemValue: T[keyof T],
  filterValue: string,
  operator = FilterOperators.Equal
) {
  const operators = {
    [FilterOperators.Equal]: () => itemValue === filterValue,
    [FilterOperators.LessThan]: () => itemValue < filterValue,
    [FilterOperators.GreaterThan]: () => itemValue > filterValue,
  };
  return operators[operator]();
}
export function filterVaultItems<T extends VaultItem>(
  items: T[],
  propertyFilters?: VaultItemPropertyFilter[],
  filterFunc?: (item: T) => boolean
) {
  if (!propertyFilters && !filterFunc) {
    return items;
  }
  return items.filter((item) => {
    if (
      propertyFilters &&
      !propertyFilters.every(
        (filter) =>
          isKeyInItem(filter.property, item) &&
          compareProperties(
            item[filter.property],
            filter.value,
            filter.operator
          )
      )
    ) {
      return false;
    }
    return filterFunc?.(item) ?? true;
  });
}
export function filterAndMapCarbonVaultItems<
  CT extends DataModelObject & {
    Id: string;
    SpaceId: string;
    LinkedIdentity?: string;
    LastUse?: number;
  },
  T extends VaultItem
>(
  items: CT[],
  identities: Identity[],
  quarantinedSpacesTeamIds: string[],
  itemMapper: (item: CT, linkedItem?: Identity) => T,
  ids?: string[]
) {
  return items.flatMap((item) => {
    if (
      quarantinedSpacesTeamIds.includes(item.SpaceId) ||
      (ids && !ids.some((id) => id.toUpperCase() === item.Id.toUpperCase()))
    ) {
      return [];
    }
    if (!item.LastUse) {
      item.LastUse = -1;
    }
    const identity = item.LinkedIdentity
      ? identities.find(
          (identityItem) => identityItem.Id === item.LinkedIdentity
        )
      : undefined;
    return itemMapper(item, identity);
  });
}
