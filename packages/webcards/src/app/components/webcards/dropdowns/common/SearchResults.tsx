import * as React from "react";
import {
  AutofillButton,
  BrowseComponent,
  Highlight,
  PageView,
  UserAutofillClickEvent,
  UserSearchVaultItemEvent,
  UserSelectVaultItemEvent,
} from "@dashlane/hermes";
import { TextInput } from "@dashlane/ui-components";
import { jsx, ThemeUIStyleObject } from "@dashlane/design-system";
import {
  AutofillCredentialsAtRisk,
  AutofillDropdownWebcardConfiguration,
  AutofillDropdownWebcardData,
  AutofillDropdownWebcardWarningType,
  AutofillRequestOriginType,
  vaultSourceTypeToHermesItemTypeMap,
  WebcardItem,
} from "@dashlane/autofill-engine/dist/autofill-engine/src/types";
import { useCommunication } from "../../../../context/communication";
import { I18nContext } from "../../../../context/i18n";
import { getSelectedItemPositionForLog } from "../../../../utils/logs";
import { CardLayout } from "../../../common/layout/CardLayout";
import { Header } from "../../../common/layout/Header";
import { useWebcardVisibilityChecker } from "../../../common/hooks/visibilityChecker";
import { SuggestedItemsList } from "../SuggestedItemsList";
import { AutofillFooter } from "../AutofillFooter";
import { SearchResultsHeader } from "./SearchResultsHeader";
import {
  SECOND_STEP_CARDS,
  SelfCorrectingAutofillOptionItem,
} from "./SelfCorrectingTree";
import { WebcardItemDetailedView } from "./WebcardItemDetailedView";
import Loader from "../../../../assets/svg/loader.svg";
import { VaultSourceType } from "@dashlane/autofill-contracts";
const SEARCHING_DELAY_IN_MS = 200;
const I18N_KEYS = {
  SEARCH_INPUT_PLACEHOLDER: "searchInputPlaceholder",
};
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  SEARCH_INPUT_CONTAINER: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "4px",
  },
  SEARCH_INPUT_TEXT: {
    "&::placeholder": { color: "ds.text.neutral.quiet" },
    border: "none",
    background: "none",
    padding: "0",
    height: "auto",
    fontSize: "12px",
  },
};
export interface SearchResultsProps {
  closeWebcard: () => void;
  onCloseSearch: () => void;
  srcElementValue?: string;
  webcardData: AutofillDropdownWebcardData;
}
export const SearchResults = ({
  closeWebcard,
  onCloseSearch,
  srcElementValue = "",
  webcardData,
}: SearchResultsProps) => {
  const {
    autofillEngineCommands,
    autofillEngineDispatcher,
    setAutofillEngineActionsHandlers,
  } = useCommunication();
  const { translate } = React.useContext(I18nContext);
  const checkWebcardVisible = useWebcardVisibilityChecker({
    webcardId: webcardData.webcardId,
    autofillEngineDispatcher,
    closeWebcard,
  });
  const initialItems = React.useRef(
    webcardData.configuration === AutofillDropdownWebcardConfiguration.Classic
      ? webcardData.items
      : []
  );
  const [results, setResults] = React.useState<WebcardItem[]>(
    initialItems.current
  );
  const [credentialsAtRisk, setCredentialsAtRisk] = React.useState<
    AutofillCredentialsAtRisk | undefined
  >(undefined);
  const [showMoreResults, setShowMoreResults] = React.useState(
    initialItems.current.length === 0
  );
  const [showItemDetails, setShowItemDetails] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<WebcardItem>();
  const [searchedValue, setSearchedValue] =
    React.useState<string>(srcElementValue);
  const [isSearching, setIsSearching] = React.useState<boolean>(false);
  const searchTimeout = React.useRef<NodeJS.Timeout>();
  React.useEffect(
    () => () => searchTimeout.current && clearTimeout(searchTimeout.current),
    []
  );
  React.useEffect(() => setSearchedValue(srcElementValue), [srcElementValue]);
  React.useEffect(() => {
    autofillEngineCommands?.logPageView({
      pageView: PageView.AutofillDropdownSuggestionSearch,
      browseComponent: BrowseComponent.Webcard,
    });
  }, [autofillEngineCommands]);
  React.useEffect(() => {
    if (!searchedValue && !showMoreResults) {
      setResults(initialItems.current);
      setShowMoreResults(initialItems.current.length === 0);
      return;
    }
    setIsSearching(true);
    autofillEngineCommands?.queryVaultItems(
      searchedValue,
      showMoreResults
        ? undefined
        : {
            autofillRecipes: webcardData.autofillRecipes,
            formClassification: webcardData.formType,
            srcElementDetails: webcardData.srcElement,
          }
    );
  }, [searchedValue, showMoreResults]);
  React.useEffect(() => {
    setAutofillEngineActionsHandlers?.({
      updateWebcardCredentialsAtRisk: (credentialsAtRisk) => {
        setCredentialsAtRisk(credentialsAtRisk);
      },
    });
    const credentialIds = results
      .filter(({ itemType }) => itemType === VaultSourceType.Credential)
      .map(({ itemId }) => itemId);
    if (credentialIds.length > 0) {
      autofillEngineCommands?.getCredentialsAtRiskByIds(credentialIds);
    }
  }, [
    setAutofillEngineActionsHandlers,
    setCredentialsAtRisk,
    autofillEngineCommands,
    results,
  ]);
  setAutofillEngineActionsHandlers?.({
    updateWebcardItems: (items) => {
      setResults(items);
      setIsSearching(false);
    },
  });
  const sendSearchVaultItemLogEvent = (
    hasUserInteractedWithSearchResults: boolean
  ) => {
    autofillEngineCommands?.logEvent(
      new UserSearchVaultItemEvent({
        highlight: showMoreResults ? Highlight.None : Highlight.Suggested,
        hasInteracted: hasUserInteractedWithSearchResults,
        charactersTypedCount: searchedValue.length,
        totalCount: results.length,
      })
    );
  };
  const onClickItemOption = (
    option: SelfCorrectingAutofillOptionItem,
    baseItem?: WebcardItem
  ) => {
    autofillEngineCommands?.applySelfCorrectingAutofill(webcardData, {
      dataSource: { [option.itemType]: option.itemProperty },
      selectedItem: selectedItem ?? baseItem,
    });
  };
  const onClickItemDetails = (item: WebcardItem) => {
    setSelectedItem(item);
    setShowItemDetails(true);
  };
  const openItemDetailsOrApplyItemOption = (item: WebcardItem) => {
    if (SECOND_STEP_CARDS[item.itemType]) {
      onClickItemDetails(item);
    } else {
      const selectedOtion = Object.values(SECOND_STEP_CARDS)
        .flatMap((card) => card)
        .find((option) => option?.itemType === item.itemType);
      if (selectedOtion) {
        onClickItemOption(selectedOtion, item);
      } else {
        closeWebcard();
      }
    }
  };
  const onClickItem = async (item: WebcardItem) => {
    const hermesItemType = vaultSourceTypeToHermesItemTypeMap[item.itemType];
    if (hermesItemType) {
      sendSearchVaultItemLogEvent(true);
      autofillEngineCommands?.logEvent(
        new UserSelectVaultItemEvent({
          highlight: showMoreResults ? Highlight.None : Highlight.Suggested,
          itemId: item.itemId,
          itemType: hermesItemType,
          totalCount: results.length,
          index: getSelectedItemPositionForLog(results, item),
        })
      );
    }
    const autofillRecipe = webcardData.autofillRecipes[item.itemType];
    if (!autofillRecipe) {
      openItemDetailsOrApplyItemOption(item);
      return;
    }
    if (await checkWebcardVisible()) {
      autofillEngineCommands?.applyAutofillRecipe({
        autofillRecipe,
        dataSource: {
          type: item.itemType,
          vaultId: item.itemId,
        },
        focusedElement: {
          elementId: webcardData.srcElement.elementId,
          frameId: webcardData.srcElement.frameId,
        },
        formClassification: webcardData.formType,
        requestOrigin: {
          type: AutofillRequestOriginType.Webcard,
          webcardType: webcardData.webcardType,
        },
      });
    }
    closeWebcard();
  };
  const onCloseItemDetails = () => {
    setSelectedItem(undefined);
    setShowItemDetails(false);
    setSearchedValue("");
  };
  const onClickAllItemsButton = () => {
    setShowMoreResults(true);
  };
  const onClickSuggestedButton = () => {
    setShowMoreResults(false);
  };
  const onInputChange = (value: string) => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      setSearchedValue(value.trim());
    }, SEARCHING_DELAY_IN_MS);
  };
  const onClickCloseButton = () => {
    sendSearchVaultItemLogEvent(false);
    autofillEngineCommands?.logEvent(
      new UserAutofillClickEvent({
        autofillButton: AutofillButton.CloseCross,
      })
    );
    onCloseSearch();
  };
  const onAddNewItem = () => {
    sendSearchVaultItemLogEvent(false);
    closeWebcard();
  };
  const header = (
    <Header isDropdown onClickClose={onClickCloseButton} withDashlaneLogo>
      <div sx={SX_STYLES.SEARCH_INPUT_CONTAINER}>
        <TextInput
          sx={SX_STYLES.SEARCH_INPUT_TEXT}
          placeholder={
            srcElementValue || translate(I18N_KEYS.SEARCH_INPUT_PLACEHOLDER)
          }
          autoFocus={!srcElementValue}
          onChange={(e) => onInputChange(e.target.value)}
          data-testid={"search-input"}
        />
        {isSearching ? <Loader /> : null}
      </div>
    </Header>
  );
  const footer =
    showMoreResults && results.length > 0 ? (
      <AutofillFooter
        warningType={AutofillDropdownWebcardWarningType.UnsecureIframe}
        closeWebcard={closeWebcard}
      />
    ) : null;
  return showItemDetails && selectedItem ? (
    <WebcardItemDetailedView
      closeWebcard={closeWebcard}
      onCloseItemDetails={onCloseItemDetails}
      webcardInfos={webcardData}
      webcardItem={selectedItem}
    />
  ) : (
    <CardLayout
      isDropdown
      header={header}
      footer={footer}
      webcardData={webcardData}
      withNoMainPadding
    >
      <SearchResultsHeader
        itemsCount={results.length}
        onClickAllItemsButton={onClickAllItemsButton}
        onClickSuggestedButton={
          initialItems.current.length ? onClickSuggestedButton : undefined
        }
        allItemsButtonSelected={showMoreResults}
      />
      <SuggestedItemsList
        onAddNewItem={onAddNewItem}
        fieldType={webcardData.fieldType?.[0]}
        items={results}
        onClickItem={onClickItem}
        onClickItemDetails={onClickItemDetails}
        searchValue={searchedValue}
        tabRootDomain={webcardData.tabRootDomain}
        tabUrl={webcardData.tabUrl}
        credentialsAtRisk={credentialsAtRisk}
        withAddNewButton
        withScroll
      />
    </CardLayout>
  );
};
