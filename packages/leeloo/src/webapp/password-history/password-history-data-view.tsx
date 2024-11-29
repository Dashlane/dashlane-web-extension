import { useRef } from "react";
import { Flex, SearchField } from "@dashlane/design-system";
import { PaginationResult } from "@dashlane/carbon-api-consumers";
import {
  CredentialPasswordHistoryItemView,
  PasswordHistoryItemView,
} from "@dashlane/communication";
import { colors, ExcludedIcon, PasswordsIcon } from "@dashlane/ui-components";
import { Button, UserClickEvent } from "@dashlane/hermes";
import { logEvent } from "../../libs/logs/logEvent";
import useTranslate from "../../libs/i18n/useTranslate";
import { EmptyView } from "../empty-view/empty-view";
import { Header as ListHeader } from "../list-view/header";
import { SortingOptions } from "../list-view/types";
import { PasswordHistoryList } from "./list";
import { getHeader, PasswordHistoryFilter } from "./list/helpers";
import { PasswordHistoryQuickFilters } from "./password-history-quick-filters";
import { PasswordCopyHandlerParams } from "./types";
import styles from "./styles.css";
const I18N_KEYS = {
  EMPTY_STATE_DESCRIPTION: "webapp_password_history_empty_state_message",
  TITLE: "webapp_password_history_title",
  SEARCH_PLACEHOLDER: "webapp_password_history_search_placeholder",
  NO_SEARCH_RESULT: "webapp_password_history_search_result_empty",
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
  onOpenRestorePasswordDialog: (
    newSelectedItem: CredentialPasswordHistoryItemView
  ) => void;
}
export const PasswordHistoryDataView = ({
  paginatedData,
  onSort,
  sortingOptions,
  onFilterChanged,
  activeFilter,
  onPasswordCopied,
  onSearchChange,
  onCreateNewCredential,
  onOpenRestorePasswordDialog,
  searchWasCleared,
  searchValue,
}: Props) => {
  const searchField = useRef<HTMLInputElement>(null);
  const { translate } = useTranslate();
  const shouldShowEmptyVaultState =
    paginatedData.items.length === 0 &&
    activeFilter === PasswordHistoryFilter.All &&
    searchValue === "" &&
    !searchWasCleared;
  const currentSearchHasNoResult =
    paginatedData.items.length === 0 && searchValue !== "";
  if (shouldShowEmptyVaultState) {
    return (
      <EmptyView icon={<PasswordsIcon size={75} color={colors.dashGreen04} />}>
        <p>{translate(I18N_KEYS.EMPTY_STATE_DESCRIPTION)}</p>
      </EmptyView>
    );
  }
  const onChangeWrapper = () => {
    onSearchChange(searchField.current?.value || "");
  };
  const onClickSearchField = () => {
    logEvent(
      new UserClickEvent({
        button: Button.SearchBar,
      })
    );
  };
  const defaultSearchString = "kw_search_string";
  const stylizeNoSearchResult = (searchQuery: string) => {
    const noSearchResultString = translate(I18N_KEYS.NO_SEARCH_RESULT, {
      query: defaultSearchString,
    });
    const [textBeforeSearchContent, textAfterSearchContent] =
      noSearchResultString.split(defaultSearchString);
    return (
      <span>
        {textBeforeSearchContent}
        <span className={styles.noSearchResult}>{searchQuery}</span>
        {textAfterSearchContent}
      </span>
    );
  };
  return (
    <Flex flexDirection="column" flexWrap="nowrap" sx={{ overflow: "hidden" }}>
      <Flex alignItems="center">
        <Flex
          as="h2"
          sx={{
            color: "ds.text.neutral.quiet",
            textTransform: "uppercase",
            fontSize: "12px",
          }}
        >
          {translate(I18N_KEYS.TITLE)}
        </Flex>
        <PasswordHistoryQuickFilters onFilterChanged={onFilterChanged} />
        <SearchField
          label={translate(I18N_KEYS.SEARCH_PLACEHOLDER)}
          ref={searchField}
          value={searchValue}
          onChange={onChangeWrapper}
          placeholder={translate(I18N_KEYS.SEARCH_PLACEHOLDER)}
          onClick={onClickSearchField}
        />
      </Flex>
      {currentSearchHasNoResult ? null : (
        <ListHeader
          header={getHeader(translate)}
          onSort={onSort}
          options={sortingOptions}
        />
      )}
      {currentSearchHasNoResult ? (
        <EmptyView icon={<ExcludedIcon size={75} color={colors.dashGreen04} />}>
          <span>{stylizeNoSearchResult(searchValue)}</span>
        </EmptyView>
      ) : (
        <PasswordHistoryList
          paginatedDataItems={paginatedData.items}
          hasNext={paginatedData.hasNextPage}
          loadNext={paginatedData.loadNextPage}
          isLoading={paginatedData.isNextPageLoading}
          onPasswordCopied={onPasswordCopied}
          onCreateNewCredential={onCreateNewCredential}
          onOpenRestorePasswordDialog={onOpenRestorePasswordDialog}
        />
      )}
    </Flex>
  );
};
