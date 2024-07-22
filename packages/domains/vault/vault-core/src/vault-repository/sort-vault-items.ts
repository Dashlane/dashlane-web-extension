import {
  SortDirection,
  VaultItem,
  VaultItemPropertySorting,
} from "@dashlane/vault-contracts";
import { isKeyInItem } from "./utility";
function sortValuesWithDirection<T extends VaultItem>(
  firstValue: NonNullable<T[keyof T]>,
  secondValue: NonNullable<T[keyof T]>,
  sortingDirection: SortDirection
) {
  const firstAsNumber = Number(firstValue);
  const secondAsNumber = Number(secondValue);
  if (typeof firstValue === "string" && typeof secondValue === "string") {
    return sortingDirection === SortDirection.Ascend
      ? firstValue.localeCompare(secondValue)
      : secondValue.localeCompare(firstValue);
  } else if (
    typeof firstValue === "number" &&
    typeof secondValue === "number"
  ) {
    return sortingDirection === SortDirection.Ascend
      ? firstValue - secondValue
      : secondValue - firstValue;
  } else if (!isNaN(firstAsNumber) && !isNaN(secondAsNumber)) {
    return sortingDirection === SortDirection.Ascend
      ? firstAsNumber - secondAsNumber
      : secondAsNumber - firstAsNumber;
  } else {
    return 0;
  }
}
export function sortVaultItems<T extends VaultItem>(
  items: T[],
  propertySorting?: VaultItemPropertySorting
) {
  if (
    !propertySorting ||
    !items.length ||
    !isKeyInItem(propertySorting.property, items[0])
  ) {
    return items;
  }
  const sortingProperty = propertySorting.property;
  const sortingDirection = propertySorting.direction || SortDirection.Ascend;
  return items.sort((firstItem, secondItem) => {
    const firstValue = firstItem[sortingProperty];
    const secondValue = secondItem[sortingProperty];
    if (!firstValue && !secondValue) {
      return 0;
    }
    if (!firstValue) {
      return sortingDirection === SortDirection.Ascend ? -1 : 1;
    }
    if (!secondValue) {
      return sortingDirection === SortDirection.Ascend ? 1 : -1;
    }
    return sortValuesWithDirection(firstValue, secondValue, sortingDirection);
  });
}
