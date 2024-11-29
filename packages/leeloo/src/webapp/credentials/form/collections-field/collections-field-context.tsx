import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { PageView } from "@dashlane/hermes";
import { DataStatus } from "@dashlane/framework-react";
import { Permission, ShareableCollection } from "@dashlane/sharing-contracts";
import { logPageView } from "../../../../libs/logs/logEvent";
import { useSpaces } from "../../../../libs/carbon/hooks/useSpaces";
import { useCollectionsContext } from "../../../collections/collections-context";
import { sortCollections } from "../../../collections/utility";
import { useIsPersonalSpaceDisabled } from "../../../../libs/hooks/use-is-personal-space-disabled";
export interface CollectionFieldVaultItemData {
  vaultItemId: string;
  vaultItemTitle: string;
  spaceId: string;
  isSharedWithLimitedRights?: boolean;
}
interface Context {
  input: string;
  itemSpaceId: string;
  isInputVisible: boolean;
  filteredCollections: ShareableCollection[];
  vaultItemCollections: FieldCollection[];
  vaultItemCollectionsToDisplay: ShareableCollection[];
  isAddCollectionDisabled?: boolean;
  vaultItem: CollectionFieldVaultItemData;
  setHasOpenedDialogs?: (value: boolean) => void;
}
interface UpdateContext {
  setInput: (input: string) => void;
  setIsInputVisible: (val: boolean) => void;
  onSubmit: (collectionName?: string, itemPermission?: Permission) => void;
  onDelete: (collectionName: string) => void;
  clearVaultItemCollections: () => void;
}
interface Provider {
  children: ReactNode;
  vaultItem: CollectionFieldVaultItemData;
  isAddCollectionDisabled?: boolean;
  setHasOpenedDialogs?: (value: boolean) => void;
  signalEditedValues?: (hasBeenEdited: boolean) => void;
  setCollectionsToUpdate?: (collectionsToUpdate: FieldCollection[]) => void;
}
const CollectionsFieldContext = createContext<Context>({} as Context);
const CollectionsFieldUpdateContext = createContext<UpdateContext>(
  {} as UpdateContext
);
interface InitiallyExistingCollection extends ShareableCollection {
  initiallyExisting: true;
  hasBeenDeleted: boolean;
  itemPermission?: Permission;
}
interface AddedCollection extends ShareableCollection {
  initiallyExisting: false;
  hasBeenDeleted?: false;
  itemPermission?: Permission;
}
type FieldCollection = InitiallyExistingCollection | AddedCollection;
const CollectionsFieldProvider = ({
  children,
  vaultItem,
  isAddCollectionDisabled,
  signalEditedValues,
  setHasOpenedDialogs,
  setCollectionsToUpdate,
}: Provider) => {
  const { vaultItemId, spaceId } = vaultItem;
  const spaces = useSpaces();
  const [input, setInput] = useState<string>("");
  const [isInputVisible, setIsInputVisible] = useState(false);
  const { allCollections } = useCollectionsContext();
  const isPersonalSpaceDisabledResult = useIsPersonalSpaceDisabled();
  const isPersonalSpaceDisabled =
    isPersonalSpaceDisabledResult.status === DataStatus.Success &&
    isPersonalSpaceDisabledResult.isDisabled;
  const [vaultItemCollections, setVaultItemCollections] = useState<
    FieldCollection[]
  >(() => {
    if (vaultItemId === "") {
      return [];
    }
    return allCollections.flatMap((collection) =>
      collection.vaultItems.some((item) => item.id === vaultItemId)
        ? {
            ...collection,
            initiallyExisting: true,
            hasBeenDeleted: false,
          }
        : []
    );
  });
  const isInBusinessSpace = (itemSpaceId: string) => {
    if (itemSpaceId === "") return false;
    const spaceList =
      spaces.status === DataStatus.Success && spaces.data.length > 0
        ? spaces?.data
        : [];
    return spaceList.some((space) => space.teamId === itemSpaceId);
  };
  const itemSpaceId = isInBusinessSpace(spaceId) ? spaceId : "";
  const vaultItemCollectionsToDisplay = useMemo(
    () =>
      vaultItemCollections.filter(
        (vaultItemCollection) => !vaultItemCollection.hasBeenDeleted
      ),
    [vaultItemCollections]
  );
  const filteredCollections = useMemo(
    () =>
      allCollections.filter(
        (collection) =>
          !vaultItemCollectionsToDisplay.some(
            (vaultItemCollection) => vaultItemCollection.id === collection.id
          )
      ),
    [allCollections, vaultItemCollectionsToDisplay]
  );
  const updateCollectionList = (
    getNewList: (previousCollections: FieldCollection[]) => FieldCollection[]
  ) => {
    const newlist = getNewList(vaultItemCollections);
    setCollectionsToUpdate?.(newlist);
    setVaultItemCollections(newlist);
  };
  const onSubmit = (collectionName = input, itemPermission?: Permission) => {
    collectionName = collectionName.trim();
    if (collectionName.length <= 0) {
      return;
    }
    const vaultItemCollectionIndex = vaultItemCollections.findIndex(
      (itemCollection) =>
        itemCollection.name === collectionName &&
        (isPersonalSpaceDisabled || itemSpaceId === itemCollection.spaceId)
    );
    if (vaultItemCollectionIndex === -1) {
      updateCollectionList((previousCollections) => {
        const newCollections = [...previousCollections];
        const collectionToAdd = allCollections.find(
          (collection) =>
            collection.name === collectionName &&
            (isPersonalSpaceDisabled || collection.spaceId === itemSpaceId)
        );
        newCollections.push({
          id: collectionToAdd?.id ?? "",
          name: collectionName,
          spaceId: itemSpaceId,
          isShared: collectionToAdd?.isShared,
          vaultItems: [],
          initiallyExisting: false,
          hasBeenDeleted: false,
          itemPermission: itemPermission,
        });
        return sortCollections(newCollections);
      });
    } else {
      const vaultItemCollection =
        vaultItemCollections[vaultItemCollectionIndex];
      if (
        vaultItemCollection.initiallyExisting &&
        vaultItemCollection.hasBeenDeleted
      ) {
        updateCollectionList((previousCollections) => {
          const newCollections = [...previousCollections];
          newCollections[vaultItemCollectionIndex].hasBeenDeleted = false;
          return newCollections;
        });
      }
    }
    signalEditedValues?.(true);
    setInput("");
  };
  const onDelete = (collectionName: string) => {
    const vaultItemCollectionIndex = vaultItemCollections.findIndex(
      (itemCollection) => itemCollection.name === collectionName
    );
    if (vaultItemCollectionIndex === -1) {
      return;
    }
    const vaultItemCollection = vaultItemCollections[vaultItemCollectionIndex];
    updateCollectionList((previousCollections) => {
      const newCollections = [...previousCollections];
      if (vaultItemCollection.initiallyExisting) {
        newCollections[vaultItemCollectionIndex].hasBeenDeleted = true;
      } else {
        newCollections.splice(vaultItemCollectionIndex, 1);
      }
      return newCollections;
    });
    logPageView(PageView.CollectionDelete);
    signalEditedValues?.(true);
  };
  const clearVaultItemCollections = () =>
    updateCollectionList((previousCollections) => {
      const newCollections = previousCollections.flatMap((collection) =>
        collection.initiallyExisting
          ? { ...collection, hasBeenDeleted: true }
          : []
      );
      return newCollections;
    });
  const updateContextValue = {
    setInput,
    setIsInputVisible,
    onSubmit,
    onDelete,
    clearVaultItemCollections,
  };
  return (
    <CollectionsFieldContext.Provider
      value={{
        input,
        itemSpaceId,
        isInputVisible,
        filteredCollections,
        vaultItemCollections,
        vaultItemCollectionsToDisplay,
        setHasOpenedDialogs,
        vaultItem,
        isAddCollectionDisabled,
      }}
    >
      <CollectionsFieldUpdateContext.Provider value={updateContextValue}>
        {children}
      </CollectionsFieldUpdateContext.Provider>
    </CollectionsFieldContext.Provider>
  );
};
const useCollectionsFieldContext = () => useContext(CollectionsFieldContext);
const useCollectionsFieldUpdateContext = () =>
  useContext(CollectionsFieldUpdateContext);
export {
  CollectionsFieldProvider,
  useCollectionsFieldContext,
  useCollectionsFieldUpdateContext,
  FieldCollection,
};
