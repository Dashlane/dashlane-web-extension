import React, { createContext, ReactNode, useContext, useMemo, useState, } from 'react';
import { PageView } from '@dashlane/hermes';
import { logPageView } from 'libs/logs/logEvent';
import { useCollectionsContext } from 'webapp/vault/collections-context';
import { sortCollections } from 'webapp/vault/utility';
import { ShareableCollection } from '@dashlane/sharing-contracts';
interface Context {
    input: string;
    isInputVisible: boolean;
    filteredCollections: ShareableCollection[];
    vaultItemCollections: FieldCollection[];
    vaultItemCollectionsToDisplay: ShareableCollection[];
    vaultItemId: string;
    vaultItemTitle: string;
    spaceId: string;
    isAddCollectionDisabled?: boolean;
    setHasOpenedDialogs?: (value: boolean) => void;
}
interface UpdateContext {
    setInput: (input: string) => void;
    setIsInputVisible: (val: boolean) => void;
    onSubmit: (collectionName?: string) => void;
    onDelete: (collectionName: string) => void;
    clearVaultItemCollections: () => void;
}
interface Provider {
    children: ReactNode;
    vaultItemId: string;
    vaultItemTitle: string;
    spaceId: string;
    isAddCollectionDisabled?: boolean;
    setHasOpenedDialogs?: (value: boolean) => void;
    signalEditedValues?: (hasBeenEdited: boolean) => void;
}
const CollectionsFieldContext = createContext<Context>({} as Context);
const CollectionsFieldUpdateContext = createContext<UpdateContext>({} as UpdateContext);
interface InitiallyExistingCollection extends ShareableCollection {
    initiallyExisting: true;
    hasBeenDeleted: boolean;
}
interface AddedCollection extends ShareableCollection {
    initiallyExisting: false;
    hasBeenDeleted?: false;
}
type FieldCollection = InitiallyExistingCollection | AddedCollection;
const CollectionsFieldProvider = ({ children, vaultItemId, vaultItemTitle, spaceId, isAddCollectionDisabled, signalEditedValues, setHasOpenedDialogs, }: Provider) => {
    const [input, setInput] = useState<string>('');
    const [isInputVisible, setIsInputVisible] = useState(false);
    const { allCollections } = useCollectionsContext();
    const [vaultItemCollections, setVaultItemCollections] = useState<FieldCollection[]>(() => {
        if (vaultItemId === '') {
            return [];
        }
        return allCollections.flatMap((collection) => collection.vaultItems.some((item) => item.id === vaultItemId)
            ? { ...collection, initiallyExisting: true, hasBeenDeleted: false }
            : []);
    });
    const vaultItemCollectionsToDisplay = useMemo(() => vaultItemCollections.filter((vaultItemCollection) => !vaultItemCollection.hasBeenDeleted), [vaultItemCollections]);
    const filteredCollections = useMemo(() => allCollections.filter((collection) => !vaultItemCollectionsToDisplay.some((vaultItemCollection) => vaultItemCollection.id === collection.id)), [allCollections, vaultItemCollectionsToDisplay]);
    const onSubmit = (collectionName = input) => {
        collectionName = collectionName.trim();
        if (collectionName.length <= 0) {
            return;
        }
        const vaultItemCollectionIndex = vaultItemCollections.findIndex((itemCollection) => itemCollection.name === collectionName);
        if (vaultItemCollectionIndex === -1) {
            setVaultItemCollections((previousCollections) => {
                const newCollections = [...previousCollections];
                const collectionToAdd = allCollections.find((collection) => collection.name === collectionName &&
                    collection.spaceId === spaceId);
                newCollections.push({
                    id: collectionToAdd?.id ?? '',
                    name: collectionName,
                    spaceId: spaceId,
                    isShared: collectionToAdd?.isShared,
                    vaultItems: [],
                    initiallyExisting: false,
                    hasBeenDeleted: false,
                });
                return sortCollections(newCollections);
            });
        }
        else {
            const vaultItemCollection = vaultItemCollections[vaultItemCollectionIndex];
            if (vaultItemCollection.initiallyExisting &&
                vaultItemCollection.hasBeenDeleted) {
                setVaultItemCollections((previousCollections) => {
                    const newCollections = [...previousCollections];
                    newCollections[vaultItemCollectionIndex].hasBeenDeleted = false;
                    return newCollections;
                });
            }
        }
        signalEditedValues?.(true);
        setInput('');
    };
    const onDelete = (collectionName: string) => {
        const vaultItemCollectionIndex = vaultItemCollections.findIndex((itemCollection) => itemCollection.name === collectionName);
        if (vaultItemCollectionIndex === -1) {
            return;
        }
        const vaultItemCollection = vaultItemCollections[vaultItemCollectionIndex];
        setVaultItemCollections((previousCollections) => {
            const newCollections = [...previousCollections];
            if (vaultItemCollection.initiallyExisting) {
                newCollections[vaultItemCollectionIndex].hasBeenDeleted = true;
            }
            else {
                newCollections.splice(vaultItemCollectionIndex, 1);
            }
            return newCollections;
        });
        logPageView(PageView.CollectionDelete);
        signalEditedValues?.(true);
    };
    const clearVaultItemCollections = () => setVaultItemCollections((previousCollections) => {
        const newCollections = previousCollections.flatMap((collection) => collection.initiallyExisting
            ? { ...collection, hasBeenDeleted: true }
            : []);
        return newCollections;
    });
    const updateContextValue = {
        setInput,
        setIsInputVisible,
        onSubmit,
        onDelete,
        clearVaultItemCollections,
    };
    return (<CollectionsFieldContext.Provider value={{
            input,
            isInputVisible,
            filteredCollections,
            vaultItemCollections,
            vaultItemCollectionsToDisplay,
            vaultItemId,
            vaultItemTitle,
            setHasOpenedDialogs,
            spaceId,
            isAddCollectionDisabled,
        }}>
      <CollectionsFieldUpdateContext.Provider value={updateContextValue}>
        {children}
      </CollectionsFieldUpdateContext.Provider>
    </CollectionsFieldContext.Provider>);
};
const useCollectionsFieldContext = () => useContext(CollectionsFieldContext);
const useCollectionsFieldUpdateContext = () => useContext(CollectionsFieldUpdateContext);
export { CollectionsFieldProvider, useCollectionsFieldContext, useCollectionsFieldUpdateContext, FieldCollection, };
