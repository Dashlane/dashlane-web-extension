import { ReactNode, useCallback } from "react";
import { VaultItem } from "@dashlane/vault-contracts";
import { DataStatus, useModuleQuery } from "@dashlane/framework-react";
import { Permission, sharingItemsApi } from "@dashlane/sharing-contracts";
import { List } from "@dashlane/design-system";
import { ItemNotFound } from "../../../../sharing-invite/item";
import { InfiniteScrollList } from "../../../../pagination/infinite-scroll-list";
export interface Permissions {
  isShared: boolean;
  isLimitedRight: boolean;
}
interface CollectionDialogListProps<T extends VaultItem> {
  items: T[];
  matchCount: number;
  notFoundText: string;
  setPageNumber: (pageNumber: number) => void;
  renderItem: (item: T, index: number, permissions: Permissions) => ReactNode;
}
export const CollectionDialogList = <T extends VaultItem>(
  props: CollectionDialogListProps<T>
) => {
  const { items, matchCount, notFoundText, setPageNumber, renderItem } = props;
  const permissionForItems = useModuleQuery(
    sharingItemsApi,
    "getPermissionForItems",
    {
      itemIds: items.map((item) => item.id),
    }
  );
  const hasMore = items.length < matchCount;
  const handleRenderItem = useCallback(
    (item: T, index: number) => {
      const isShared = !!permissionForItems?.data?.[item.id];
      const isLimitedRight =
        permissionForItems?.data?.[item.id] === Permission.Limited;
      return renderItem(item, index, { isShared, isLimitedRight });
    },
    [permissionForItems.data, renderItem]
  );
  if (
    permissionForItems.status !== DataStatus.Success ||
    !permissionForItems.data
  ) {
    return null;
  }
  if (!items.length) {
    return <ItemNotFound text={notFoundText} />;
  }
  return (
    <InfiniteScrollList
      onNextPage={setPageNumber}
      hasMore={hasMore}
      ListComponent={List}
      sx={{
        paddingBottom: "20px",
      }}
    >
      {items.map(handleRenderItem)}
    </InfiniteScrollList>
  );
};
