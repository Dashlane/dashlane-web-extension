import React from "react";
import {
  AddToCollectionAction,
  AddToCollectionActionProps,
} from "./add-to-collection-action";
import { RemoveCollectionQuickAction } from "./remove-collection-quick-action";
import { ActiveActionProvider } from "./active-action-context";
export const CollectionQuickActions = ({
  itemSpaceId,
  ...rest
}: AddToCollectionActionProps) => {
  return (
    <ActiveActionProvider>
      <AddToCollectionAction itemSpaceId={itemSpaceId} {...rest} />
      <RemoveCollectionQuickAction {...rest} />
    </ActiveActionProvider>
  );
};
