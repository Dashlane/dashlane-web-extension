import React, { createContext, KeyboardEvent, ReactNode, useContext, useEffect, useRef, } from 'react';
import { useSearchContext } from 'src/app/vault/search-field/search-context';
import { useActiveTabInfoContext } from 'src/app/vault/tabs-bar/active-tab-info-context';
import listRowStyles from './section-list-row/styles.css';
interface Context {
    onKeyDown: (e: KeyboardEvent) => void;
}
interface Provider {
    children: ReactNode;
}
const ListKeyboardNavContext = createContext<Context>({} as Context);
const ListKeyboardNavProvider = ({ children }: Provider) => {
    const { activeTabInfo } = useActiveTabInfoContext();
    const { searchValue, focusSearchField } = useSearchContext();
    const focusedListItemIndexRef = useRef(0);
    useEffect(() => {
        focusedListItemIndexRef.current = 0;
    }, [activeTabInfo.name, searchValue]);
    const onKeyDown = (e: React.KeyboardEvent) => {
        if (!['ArrowUp', 'ArrowDown'].includes(e.key)) {
            return;
        }
        const listItems = document.querySelectorAll(`.${CSS.escape(listRowStyles.content)}`);
        if (!listItems ||
            (e.key === 'ArrowDown' &&
                focusedListItemIndexRef.current >= listItems.length - 1)) {
            return;
        }
        focusedListItemIndexRef.current += e.key === 'ArrowUp' ? -1 : 1;
        if (focusedListItemIndexRef.current < 0) {
            focusedListItemIndexRef.current = 0;
            focusSearchField();
        }
        else {
            (listItems[focusedListItemIndexRef.current] as HTMLElement).focus();
        }
    };
    return (<ListKeyboardNavContext.Provider value={{ onKeyDown }}>
      {children}
    </ListKeyboardNavContext.Provider>);
};
const useListKeyboardNavContext = () => useContext(ListKeyboardNavContext);
export { ListKeyboardNavProvider, useListKeyboardNavContext };
