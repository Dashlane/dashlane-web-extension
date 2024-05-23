import { createRef, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { debounce } from 'lodash';
import { Lee } from 'lee';
import { CSSTransition } from 'react-transition-group';
import classnames from 'classnames';
import { jsx } from '@dashlane/design-system';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import useTranslate from 'libs/i18n/useTranslate';
import cancelSearchTransitionStyles from './cancel-search-transitions.css';
import searchIconTransitionStyles from './search-icon-transitions.css';
import searchResultsTransitionStyles from './search-results-transitions.css';
import { SearchResults } from 'webapp/sidemenu/search/results/search-results';
import SearchEventLogger from './search-event-logger';
import styles from './styles.css';
const DEBOUNCE_DELAY_MS = 100;
const I18N_KEYS = {
    SEARCH_PLACEHOLDER: 'webapp_sidemenu_search_placeholder',
};
interface Props {
    disabled?: boolean;
    lee: Lee;
    onInputChange: (hasContent: boolean) => void;
    onInputFocus: () => void;
    handleClickOutsideSearch: () => void;
}
export const Search = ({ disabled, lee, onInputChange, onInputFocus, handleClickOutsideSearch, }: Props) => {
    const [searchIcon, setSearchIcon] = useState(true);
    const [query, setQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [hasSearchLogHasBeenSent, setHasSearchLogHasBeenSent] = useState(false);
    const searchInput = createRef<HTMLInputElement>();
    const { routes } = useRouterGlobalSettingsContext();
    const { pathname } = useLocation();
    const { translate } = useTranslate();
    const getTrimmedQuery = () => searchInput.current ? searchInput.current.value.trim() : '';
    const onQueryChange = () => {
        const trimmedQuery = getTrimmedQuery();
        const searchFieldHasContents = trimmedQuery.length > 0;
        setHasSearchLogHasBeenSent(false);
        setQuery(trimmedQuery);
        setShowSearchResults(searchFieldHasContents);
        onInputChange(searchFieldHasContents);
    };
    const handleInputChange = debounce(onQueryChange, DEBOUNCE_DELAY_MS);
    const handleInputFocus = () => {
        const trimmedQuery = getTrimmedQuery();
        const searchFieldHasContents = trimmedQuery.length > 0;
        setSearchIcon(false);
        setShowSearchResults(searchFieldHasContents);
        onInputFocus();
    };
    const handleInputBlur = () => {
        if (!query) {
            setSearchIcon(true);
            setShowSearchResults(false);
            handleClickOutsideSearch();
        }
        else if (!hasSearchLogHasBeenSent) {
            SearchEventLogger.charactersTypedCount = query.length;
            SearchEventLogger.logSearchEvent(false);
            setHasSearchLogHasBeenSent(true);
        }
    };
    const clearSearch = () => {
        if (searchInput.current) {
            searchInput.current.value = '';
        }
        handleInputChange();
        setSearchIcon(true);
    };
    useEffect(() => {
        const isNewPathRelevantToSearch: boolean = [
            routes.userCredentials,
            routes.userIdsDocuments,
            routes.userPayments,
            routes.userPersonalInfo,
            routes.userSecureNotes,
        ].some((route) => pathname.startsWith(route));
        if (searchInput.current?.value && !isNewPathRelevantToSearch) {
            clearSearch();
        }
    }, [pathname]);
    const onClickStartSearch = (): void => {
        if (searchInput.current) {
            searchInput.current.focus();
        }
    };
    return (<div className={styles.searchInputWrapper}>
      <span className={styles.searchWrapper}>
        {!searchIcon && !disabled && (<CSSTransition classNames={cancelSearchTransitionStyles} timeout={300}>
            <span className={styles.cancelSearchIcon} onClick={clearSearch}/>
          </CSSTransition>)}
        <div className={styles.animatedSearchIcon}>
          {searchIcon && !disabled && (<CSSTransition classNames={searchIconTransitionStyles} timeout={300}>
              <span className={styles.searchIcon} onClick={onClickStartSearch}/>
            </CSSTransition>)}
        </div>
        <input ref={searchInput} type="search" placeholder={translate(I18N_KEYS.SEARCH_PLACEHOLDER)} disabled={disabled} className={classnames(styles.search, {
            [styles.searchActive]: query,
        })} onFocus={handleInputFocus} sx={{
            '::placeholder': {
                color: 'ds.text.neutral.quiet',
            },
        }} onBlur={handleInputBlur} onChange={handleInputChange}/>
      </span>
      {showSearchResults && (<CSSTransition classNames={searchResultsTransitionStyles} timeout={{
                enter: 500,
                exit: 300,
            }}>
          <div className={styles.searchResults}>
            <SearchResults lee={lee} query={query}/>
          </div>
        </CSSTransition>)}
    </div>);
};
