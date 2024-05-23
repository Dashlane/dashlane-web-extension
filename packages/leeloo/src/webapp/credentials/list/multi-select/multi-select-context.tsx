import React, { createContext, ReactNode, useContext, useMemo, useState, } from 'react';
import { Credential } from '@dashlane/vault-contracts';
interface Context {
    selectedItems: Credential[];
}
interface UpdateContext {
    clearSelection: () => void;
    toggleSelectItem: (item: Credential) => void;
    toggleSelectItems: (items: Credential[]) => void;
}
interface Provider {
    children: ReactNode;
}
const MultiselectContext = createContext<Context>({} as Context);
const MultiselectUpdateContext = createContext<UpdateContext>({} as UpdateContext);
const MultiselectProvider = ({ children }: Provider) => {
    const [selectedItems, setSelectedItems] = useState<Credential[]>([]);
    const toggleItem = (item: Credential, items: Credential[]) => {
        const existingItemIndex = items.findIndex((existingItem) => existingItem.id === item.id);
        if (existingItemIndex === -1) {
            items.push(item);
        }
        else {
            items.splice(existingItemIndex, 1);
        }
    };
    const contextUpdateValue = useMemo(() => ({
        clearSelection: () => setSelectedItems([]),
        toggleSelectItem: (item: Credential) => {
            setSelectedItems((previousItems) => {
                const newItems = [...previousItems];
                toggleItem(item, newItems);
                return newItems;
            });
        },
        toggleSelectItems: (items: Credential[]) => {
            setSelectedItems((previousItems) => {
                const newItems = [...previousItems];
                items.forEach((item) => {
                    toggleItem(item, newItems);
                });
                return newItems;
            });
        },
    }), []);
    const contextValue = {
        selectedItems,
    };
    return (<MultiselectContext.Provider value={contextValue}>
      <MultiselectUpdateContext.Provider value={contextUpdateValue}>
        {children}
      </MultiselectUpdateContext.Provider>
    </MultiselectContext.Provider>);
};
const useMultiselectContext = () => useContext(MultiselectContext);
const useMultiselectUpdateContext = () => useContext(MultiselectUpdateContext);
export { MultiselectProvider, useMultiselectContext, useMultiselectUpdateContext, };
