import React, { createContext, ReactNode, useContext, useMemo, useState, } from 'react';
interface Context {
    searchValue: string;
}
interface UpdateContext {
    setSearchValue: (query: string) => void;
}
interface Provider {
    children: ReactNode;
}
const CollectionsOverviewContext = createContext<Context>({} as Context);
const CollectionsOverviewUpdateContext = createContext<UpdateContext>({} as UpdateContext);
const CollectionsOverviewProvider = ({ children }: Provider) => {
    const [searchValue, setSearchValue] = useState('');
    const contextValue = {
        searchValue,
    };
    const contextUpdateValue = useMemo(() => ({
        setSearchValue,
    }), []);
    return (<CollectionsOverviewContext.Provider value={contextValue}>
      <CollectionsOverviewUpdateContext.Provider value={contextUpdateValue}>
        {children}
      </CollectionsOverviewUpdateContext.Provider>
    </CollectionsOverviewContext.Provider>);
};
const useCollectionsOverviewContext = () => useContext(CollectionsOverviewContext);
const useCollectionsOverviewUpdateContext = () => useContext(CollectionsOverviewUpdateContext);
export { CollectionsOverviewProvider, useCollectionsOverviewContext, useCollectionsOverviewUpdateContext, };
