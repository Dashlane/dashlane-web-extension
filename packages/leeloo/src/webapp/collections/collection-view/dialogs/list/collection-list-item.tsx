import { MouseEvent, ReactNode } from "react";
import { CollectionListItem } from "./collection-list-row";
import {
  SelectableItemType,
  useMultiselectContext,
  useMultiselectUpdateContext,
} from "../../../../list-view/multi-select/multi-select-context";
export interface SelectableCollectionListItemProps {
  id: string;
  title: string;
  description?: string;
  isShared: boolean;
  isLimitedRight: boolean;
  isDisabled: boolean;
  tooltip: ReactNode;
  thumbnail: ReactNode;
  type: SelectableItemType;
  onToggle: (event: MouseEvent) => void;
}
export const SelectableCollectionListItem = ({
  id,
  title,
  description,
  isLimitedRight,
  isShared,
  isDisabled,
  tooltip,
  thumbnail,
  type,
  onToggle,
}: SelectableCollectionListItemProps) => {
  const { isSelected } = useMultiselectContext();
  const { toggleSelectedItems } = useMultiselectUpdateContext();
  const isItemSelected = isSelected(id, type);
  if (isItemSelected && isDisabled) {
    toggleSelectedItems(new Set([id]), type);
  }
  return (
    <CollectionListItem
      title={title}
      description={description}
      isShared={isShared}
      isDisabled={isDisabled}
      isSelected={isItemSelected}
      isLimitedRight={isLimitedRight}
      onToggle={onToggle}
      tooltip={tooltip}
      thumbnail={thumbnail}
    />
  );
};
