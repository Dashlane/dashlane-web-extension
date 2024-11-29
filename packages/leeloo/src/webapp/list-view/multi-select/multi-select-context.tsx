import {
  ChangeEvent,
  createContext,
  MouseEvent,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { SharingStatus } from "@dashlane/sharing-contracts";
export type SelectableItemType =
  | "credentials"
  | "notes"
  | "secrets"
  | "users"
  | "groups";
interface Context {
  getSelectedItems: (types: SelectableItemType[]) => string[];
  isSelected: (id: string, type: SelectableItemType) => boolean;
}
interface UpdateContext {
  clearSelection: () => void;
  toggleSelectedItems: (items: Set<string>, type: SelectableItemType) => void;
}
interface MultiSelectProvider {
  children: ReactNode;
  initialSelectedItems?: Partial<Record<SelectableItemType, Set<string>>>;
}
const MultiselectContext = createContext<Context>({} as Context);
const MultiselectUpdateContext = createContext<UpdateContext>(
  {} as UpdateContext
);
type SelectedItemsRecord = Partial<Record<SelectableItemType, Set<string>>>;
const MultiselectProvider = ({
  children,
  initialSelectedItems,
}: MultiSelectProvider) => {
  const [selectedItems, setSelectedItems] = useState<SelectedItemsRecord>(
    initialSelectedItems ?? {}
  );
  const toggleItem = (itemsToUpdate: Set<string>, newItem: string) => {
    if (itemsToUpdate.has(newItem)) {
      itemsToUpdate.delete(newItem);
    } else {
      itemsToUpdate.add(newItem);
    }
  };
  const toggleItems = useCallback(
    (itemsToUpdate: Set<string>, newItems: Set<string>) => {
      if (newItems.size > 1) {
        newItems.forEach((item) => itemsToUpdate.add(item));
      } else {
        const itemToToggle = [...newItems][0];
        toggleItem(itemsToUpdate, itemToToggle);
      }
      return itemsToUpdate;
    },
    []
  );
  const toggleSelectedItems = useCallback(
    (newItems: Set<string>, type: SelectableItemType) => {
      setSelectedItems((previousItems) => {
        const updatedItems = { ...previousItems };
        let newItemsOfType = previousItems[type] ?? new Set();
        newItemsOfType = new Set(toggleItems(newItemsOfType, newItems));
        updatedItems[type] = newItemsOfType;
        return updatedItems;
      });
    },
    [toggleItems]
  );
  const clearSelection = useCallback(() => setSelectedItems({}), []);
  const isSelected = useCallback(
    (id: string, type: SelectableItemType) => !!selectedItems[type]?.has(id),
    [selectedItems]
  );
  const getSelectedItems = useCallback(
    (types: SelectableItemType[]) => {
      return types.flatMap((type) => {
        const itemsOfType = selectedItems[type] ?? [];
        return [...itemsOfType];
      });
    },
    [selectedItems]
  );
  const contextValue = useMemo(
    () => ({
      getSelectedItems,
      isSelected,
    }),
    [getSelectedItems, isSelected]
  );
  const contextUpdateValue = useMemo(
    () => ({
      clearSelection,
      toggleSelectedItems,
    }),
    [clearSelection, toggleSelectedItems]
  );
  return (
    <MultiselectContext.Provider value={contextValue}>
      <MultiselectUpdateContext.Provider value={contextUpdateValue}>
        {children}
      </MultiselectUpdateContext.Provider>
    </MultiselectContext.Provider>
  );
};
const useMultiselectContext = () => useContext(MultiselectContext);
const useMultiselectUpdateContext = () => useContext(MultiselectUpdateContext);
export {
  MultiselectProvider,
  useMultiselectContext,
  useMultiselectUpdateContext,
};
export const handleMultiSelectAction = (
  listItems: Array<{
    id?: string;
    groupId?: string;
  }>,
  sharingStatus: Record<string, SharingStatus> | undefined,
  selectedItemId: string,
  lastSelectedIndex: number,
  event: ChangeEvent | MouseEvent,
  type: SelectableItemType,
  getType?: (item: { id?: string; groupId?: string }) => SelectableItemType
): {
  newSelectedItems: SelectedItemsRecord;
  newLastSelectedIndex: number;
} => {
  const isShiftKeyPressed = event.nativeEvent.shiftKey;
  const selectedItemIndex = listItems.findIndex(
    (item) => item?.id === selectedItemId || item?.groupId === selectedItemId
  );
  if (isShiftKeyPressed) {
    let upperIndex: number;
    let lowerIndex: number;
    if (selectedItemIndex > lastSelectedIndex) {
      upperIndex = selectedItemIndex;
      lowerIndex = lastSelectedIndex + 1;
    } else {
      upperIndex = lastSelectedIndex;
      lowerIndex = selectedItemIndex;
    }
    const indexRangeToAdd = Array.from(
      { length: upperIndex - lowerIndex + 1 },
      (val, index) => lowerIndex + index
    );
    const newSelectedItems: SelectedItemsRecord = {};
    indexRangeToAdd.forEach((listIndex) => {
      const item = listItems[listIndex];
      const itemId = item.id ?? item.groupId ?? "";
      const itemType = getType ? getType(item) : type;
      if (sharingStatus?.[itemId]?.isShared) {
        return;
      }
      if (newSelectedItems[itemType]?.size) {
        newSelectedItems[itemType]?.add(itemId);
      } else {
        newSelectedItems[itemType] = new Set([itemId]);
      }
    });
    return {
      newSelectedItems,
      newLastSelectedIndex: selectedItemIndex,
    };
  } else {
    const newSelectedItems: SelectedItemsRecord = {};
    newSelectedItems[type] = new Set([selectedItemId]);
    return {
      newSelectedItems,
      newLastSelectedIndex: selectedItemIndex,
    };
  }
};
export const useMultiselectHandler = (
  entities: Array<{
    id?: string;
    groupId?: string;
  }>,
  sharingStatus?: Record<string, SharingStatus>
) => {
  const localLastSelectedIndex = useRef(0);
  const { toggleSelectedItems } = useMultiselectUpdateContext();
  return useCallback(
    (
      entityId: string,
      type: SelectableItemType,
      event: ChangeEvent | MouseEvent,
      getType?: (item: { id?: string; groupId?: string }) => SelectableItemType
    ) => {
      const { newSelectedItems, newLastSelectedIndex } =
        handleMultiSelectAction(
          entities,
          sharingStatus,
          entityId,
          localLastSelectedIndex.current,
          event,
          type,
          getType
        );
      localLastSelectedIndex.current = newLastSelectedIndex;
      Object.keys(newSelectedItems).forEach((key) => {
        toggleSelectedItems(newSelectedItems[key], key as SelectableItemType);
      });
    },
    [entities, sharingStatus, toggleSelectedItems]
  );
};
