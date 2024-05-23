import React, { createContext, ReactNode, useCallback, useContext, useRef, useState, } from 'react';
import SearchEventLogger from '../search-event-logger';
import { SearchField } from './search-field';
interface Context {
    searchValue: string;
    setSearchValue: (query: string) => void;
    focusSearchField: () => void;
}
interface Provider {
    children: ReactNode;
    navigateToVaultTab?: () => void;
}
const SearchContext = createContext<Context>({} as Context);
const SearchProvider = ({ children, navigateToVaultTab }: Provider) => {
    const [searchValue, setSearchValue] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);
    const focusSearchField = useCallback(() => {
        searchInputRef.current?.focus();
    }, [searchInputRef]);
    const contextValue = {
        searchValue,
        setSearchValue: (value: string) => {
            setSearchValue(value);
            navigateToVaultTab?.();
            SearchEventLogger.charactersTypedCount = searchValue.length;
        },
        focusSearchField,
    };
    return (<SearchContext.Provider value={contextValue}>
      <SearchField searchInputRef={searchInputRef}/>
      {children}
    </SearchContext.Provider>);
};
const useSearchContext = () => useContext(SearchContext);
export { SearchProvider, useSearchContext };
