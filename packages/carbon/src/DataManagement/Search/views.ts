import { ListResults } from "@dashlane/communication";
export const viewListResults = <T, V>(
  listView: (items: T[]) => V[]
): ((searchResults: ListResults<T>) => ListResults<V>) => {
  return ({ items, matchingCount }) => ({
    items: listView(items),
    matchingCount,
  });
};
