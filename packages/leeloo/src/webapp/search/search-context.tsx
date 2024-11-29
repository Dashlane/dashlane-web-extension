import { createContext, ReactNode, useContext, useState } from "react";
interface Context {
  searchValue: string;
  setSearchValue: (query: string) => void;
  isOpen: boolean;
  closeSearch: () => void;
  openSearch: () => void;
}
interface Provider {
  children: ReactNode;
}
const SearchContext = createContext<Context>({} as Context);
const SearchProvider = ({ children }: Provider) => {
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const contextValue = {
    searchValue,
    setSearchValue: (value: string) => setSearchValue(value),
    isOpen,
    closeSearch: () => setIsOpen(false),
    openSearch: () => setIsOpen(true),
  };
  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};
const useSearchContext = () => useContext(SearchContext);
export { SearchProvider, useSearchContext };
