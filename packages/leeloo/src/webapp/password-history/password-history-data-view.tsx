import { useRef } from 'react';
import { PaginationResult } from '@dashlane/carbon-api-consumers';
import { CredentialPasswordHistoryItemView, PasswordHistoryItemView, } from '@dashlane/communication';
import { CloseIcon, colors, ExcludedIcon, FlexContainer, HorizontalNavMenu, jsx, PasswordsIcon, SearchIcon, TextInput, } from '@dashlane/ui-components';
import { Button, UserClickEvent } from '@dashlane/hermes';
import colorVars from 'libs/dashlane-style/globals/color-variables.css';
import { logEvent } from 'libs/logs/logEvent';
import useTranslate from 'libs/i18n/useTranslate';
import { EmptyView } from 'webapp/empty-view/empty-view';
import { Header as ListHeader } from 'webapp/list-view/header';
import { SortingOptions } from 'webapp/list-view/types';
import { PasswordHistoryList } from './list';
import { getHeader, PasswordHistoryFilter } from './list/helpers';
import { PasswordHistoryQuickFilters } from './password-history-quick-filters';
import { PasswordCopyHandlerParams } from './types';
import styles from './styles.css';
const I18N_KEYS = {
    EMPTY_STATE_DESCRIPTION: 'webapp_password_history_empty_state_message',
    TITLE: 'webapp_password_history_title',
    SEARCH_PLACEHOLDER: 'webapp_password_history_search_placeholder',
    NO_SEARCH_RESULT: 'webapp_password_history_search_result_empty',
};
interface Props {
    paginatedData: PaginationResult<PasswordHistoryItemView>;
    onSort: (sortingOptions: SortingOptions) => void;
    sortingOptions: SortingOptions;
    onFilterChanged: (filter: PasswordHistoryFilter) => void;
    activeFilter: PasswordHistoryFilter;
    onSearchChange: (search: string) => void;
    onClearSearchChange: () => void;
    searchWasCleared: boolean;
    searchValue: string;
    onPasswordCopied: (copyHandlerParams: PasswordCopyHandlerParams) => void;
    onCreateNewCredential: (generatedPassword: string, website?: string) => void;
    onOpenRestorePasswordDialog: (newSelectedItem: CredentialPasswordHistoryItemView) => void;
}
export const PasswordHistoryDataView = ({ paginatedData, onSort, sortingOptions, onFilterChanged, activeFilter, onPasswordCopied, onSearchChange, onClearSearchChange, onCreateNewCredential, onOpenRestorePasswordDialog, searchWasCleared, searchValue, }: Props) => {
    const searchField = useRef<HTMLInputElement>(null);
    const { translate } = useTranslate();
    const shouldShowEmptyVaultState = paginatedData.items.length === 0 &&
        activeFilter === PasswordHistoryFilter.All &&
        searchValue === '' &&
        !searchWasCleared;
    const currentSearchHasNoResult = paginatedData.items.length === 0 && searchValue !== '';
    if (shouldShowEmptyVaultState) {
        return (<EmptyView icon={<PasswordsIcon size={75} color={colors.dashGreen04}/>}>
        <p>{translate(I18N_KEYS.EMPTY_STATE_DESCRIPTION)}</p>
      </EmptyView>);
    }
    const onChangeWrapper = () => {
        onSearchChange(searchField.current?.value || '');
    };
    const onClickSearchField = () => {
        logEvent(new UserClickEvent({
            button: Button.SearchBar,
        }));
    };
    const defaultSearchString = 'kw_search_string';
    const stylizeNoSearchResult = (searchQuery: string) => {
        const noSearchResultString = translate(I18N_KEYS.NO_SEARCH_RESULT, {
            query: defaultSearchString,
        });
        const [textBeforeSearchContent, textAfterSearchContent] = noSearchResultString.split(defaultSearchString);
        return (<span>
        {textBeforeSearchContent}
        <span className={styles.noSearchResult}>{searchQuery}</span>
        {textAfterSearchContent}
      </span>);
    };
    return (<FlexContainer flexDirection="column" flexWrap="nowrap" sx={{ overflow: 'hidden' }}>
      <FlexContainer alignItems="center" sx={{ margin: '32px', marginBottom: '20px' }}>
        <FlexContainer as="h2" sx={{
            color: colors.dashGreen02,
            textTransform: 'uppercase',
            fontSize: '12px',
        }}>
          {translate(I18N_KEYS.TITLE)}
        </FlexContainer>
        <PasswordHistoryQuickFilters activeFilter={activeFilter} onFilterChanged={onFilterChanged}/>
        {<HorizontalNavMenu>
            <TextInput role="search" ref={searchField} value={searchValue} onChange={onChangeWrapper} placeholder={translate(I18N_KEYS.SEARCH_PLACEHOLDER)} onClick={onClickSearchField} endAdornment={searchValue.length > 0 ? (<button className={styles.clearSearchButton} onClick={onClearSearchChange}>
                    <CloseIcon size={20} color={colorVars['--grey-02']} hoverColor={colorVars['--grey-01']}/>
                  </button>) : (<SearchIcon />)}/>
          </HorizontalNavMenu>}
      </FlexContainer>
      {currentSearchHasNoResult ? null : (<ListHeader header={getHeader(translate)} onSort={onSort} options={sortingOptions}/>)}
      {currentSearchHasNoResult ? (<EmptyView icon={<ExcludedIcon size={75} color={colors.dashGreen04}/>}>
          <span>{stylizeNoSearchResult(searchValue)}</span>
        </EmptyView>) : (<PasswordHistoryList paginatedDataItems={paginatedData.items} hasNext={paginatedData.hasNextPage} loadNext={paginatedData.loadNextPage} isLoading={paginatedData.isNextPageLoading} onPasswordCopied={onPasswordCopied} onCreateNewCredential={onCreateNewCredential} onOpenRestorePasswordDialog={onOpenRestorePasswordDialog}/>)}
    </FlexContainer>);
};
