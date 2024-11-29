import { useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "lodash";
import {
  DataStatus,
  PaginatedEndpointResult,
  usePaginatedEndpoint,
} from "@dashlane/carbon-api-consumers";
import {
  CredentialPasswordHistoryItemView,
  NotificationName,
  PasswordHistoryFirstTokenParams,
  PasswordHistoryItemView,
} from "@dashlane/communication";
import { Flex, useToast } from "@dashlane/design-system";
import {
  Action,
  Field,
  ItemType,
  PageView,
  Space,
  UserCopyVaultItemFieldEvent,
  UserUpdateVaultItemEvent,
} from "@dashlane/hermes";
import useTranslate from "../../libs/i18n/useTranslate";
import { carbonConnector } from "../../libs/carbon/connector";
import { useNotificationInteracted } from "../../libs/carbon/hooks/useNotificationStatus";
import { logEvent, logPageView } from "../../libs/logs/logEvent";
import { PASSWORD_HISTORY_LIST_SORT_PREFERENCES } from "../../libs/localstorage-constants";
import { usePasswordLimitPaywall } from "../../libs/paywall/paywallContext";
import { useHistory, useParams } from "../../libs/router";
import { useRouterGlobalSettingsContext } from "../../libs/router/RouterGlobalSettingsProvider";
import { OrderDir } from "../../libs/sortHelper";
import { PasswordLimitDialog } from "../credentials/header/password-limit-dialog";
import { SortingOptions } from "../list-view/types";
import { PersonalDataSectionView } from "../personal-data-section-view/personal-data-section-view";
import {
  getFilterCriteria,
  getSortCriteriaFromSortingOptions,
  PasswordHistoryFilter,
} from "./list/helpers";
import { PasswordHistoryDataView } from "./password-history-data-view";
import { PasswordHistoryHeader } from "./password-history-header";
import { PasswordHistoryInfobox } from "./password-history-infobox";
import { RestorePasswordDialog } from "./password-history-restore-dialog";
import { PasswordCopyHandlerParams, PasswordHistoryRouteParams } from "./types";
import { WithBaseLayout } from "../layout/with-layout";
const I18N_KEYS = {
  COPY_PASSWORD_ERROR:
    "webapp_credentials_quick_actions_copy_password_feedback_not_ok",
  COPY_PASSWORD_OK:
    "webapp_password_history_quick_action_copy_password_success_message",
  RESTORE_PASSWORD_OK:
    "webapp_password_history_quick_action_restore_password_success_message",
  RESTORE_PASSWORD_ERROR: "_common_generic_error",
};
const DEBOUNCE_DELAY_MS = 100;
const PasswordHistory = () => {
  const { translate } = useTranslate();
  const { showToast } = useToast();
  const usePasswordLimitResult = usePasswordLimitPaywall();
  const shouldShowAtOrOverLimitContent =
    !usePasswordLimitResult.isLoading &&
    usePasswordLimitResult.shouldShowAtOrOverLimitContent;
  const { routes } = useRouterGlobalSettingsContext();
  const history = useHistory();
  const [sortingOptions, setSortingOptions] = useState<SortingOptions>({
    field: "timestamp",
    direction: OrderDir.descending,
  });
  const { interacted, setAsInteracted } = useNotificationInteracted(
    NotificationName.PasswordHistoryBanner
  );
  const [activeFilter, setActiveFilter] = useState<PasswordHistoryFilter>(
    PasswordHistoryFilter.All
  );
  const [searchValue, setSearchValue] = useState("");
  const [searchValueToFetch, setSearchValueToFetch] = useState("");
  const [searchWasCleared, setSearchWasCleared] = useState(false);
  const [isPaywallVisible, setIsPaywallVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<
    CredentialPasswordHistoryItemView | undefined
  >();
  const [restorePasswordDialogOpen, setRestorePasswordDialogOpen] =
    useState(false);
  const { credentialId } = useParams<PasswordHistoryRouteParams>();
  const passwordHistoryItemsRef = useRef<
    PaginatedEndpointResult<PasswordHistoryItemView>
  >({ status: DataStatus.Loading });
  const restoreFromStorage = () => {
    const preferences = localStorage.getItem(
      PASSWORD_HISTORY_LIST_SORT_PREFERENCES
    );
    try {
      if (preferences) {
        const storedSorting = JSON.parse(preferences);
        setSortingOptions(storedSorting);
      }
    } catch (err) {}
  };
  useEffect(() => {
    logPageView(PageView.PasswordHistory);
    restoreFromStorage();
  }, []);
  const onSaveToStorage = (newSortingOptions: SortingOptions) => {
    localStorage.setItem(
      PASSWORD_HISTORY_LIST_SORT_PREFERENCES,
      JSON.stringify(newSortingOptions)
    );
  };
  const onSort = (newSortingOptions: SortingOptions) => {
    setSortingOptions(newSortingOptions);
    onSaveToStorage(newSortingOptions);
  };
  const onFilterChanged = (newFilter: PasswordHistoryFilter) => {
    setActiveFilter(newFilter);
    switch (newFilter) {
      case PasswordHistoryFilter.All:
        logPageView(PageView.PasswordHistoryAll);
        break;
      case PasswordHistoryFilter.Saved:
        logPageView(PageView.PasswordHistorySaved);
        break;
      case PasswordHistoryFilter.Unsaved:
        logPageView(PageView.PasswordHistoryUnsaved);
        break;
    }
  };
  const onPasswordCopied = ({
    success,
    isProtected,
    itemId,
  }: PasswordCopyHandlerParams) => {
    if (success) {
      showToast({ description: translate(I18N_KEYS.COPY_PASSWORD_OK) });
    } else {
      showToast({
        description: translate(I18N_KEYS.COPY_PASSWORD_ERROR),
        mood: "danger",
      });
    }
    logEvent(
      new UserCopyVaultItemFieldEvent({
        field: Field.Password,
        isProtected,
        itemType: ItemType.Credential,
        itemId,
      })
    );
  };
  const onPasswordRestored = (
    item: CredentialPasswordHistoryItemView,
    success: boolean
  ) => {
    if (success) {
      showToast({ description: translate(I18N_KEYS.RESTORE_PASSWORD_OK) });
      logEvent(
        new UserUpdateVaultItemEvent({
          action: Action.Edit,
          itemId: item.credentialId,
          itemType: ItemType.Credential,
          space: item.spaceId ? Space.Professional : Space.Personal,
        })
      );
    } else {
      showToast({
        description: translate(I18N_KEYS.RESTORE_PASSWORD_ERROR),
        mood: "danger",
      });
    }
    setSelectedItem(undefined);
  };
  const onOpenRestorePasswordDialog = (
    newSelectedItem: CredentialPasswordHistoryItemView
  ) => {
    setSelectedItem(newSelectedItem);
    setRestorePasswordDialogOpen(true);
  };
  const onCloseRestorePasswordDialog = () => {
    setRestorePasswordDialogOpen(false);
  };
  const onSearchChange = (search: string) => {
    setSearchValue(search);
  };
  const onClearSearchChange = () => {
    setSearchValue("");
    setSearchValueToFetch("");
    setSearchWasCleared(true);
  };
  const onCreateNewCredential = (
    generatedPassword: string,
    website?: string
  ) => {
    if (shouldShowAtOrOverLimitContent) {
      setIsPaywallVisible(true);
    } else {
      history.push(
        routes.userAddWebsiteCredentialWithPrefilledParameters({
          website: website ?? "",
          previouslyGeneratedPassword: generatedPassword,
        })
      );
    }
  };
  const debouncedSetSearchValue = useMemo(() => {
    return debounce((value: string) => {
      setSearchValueToFetch(value);
    }, DEBOUNCE_DELAY_MS);
  }, []);
  useEffect(() => {
    debouncedSetSearchValue(searchValue);
  }, [debouncedSetSearchValue, searchValue]);
  const tokenQueryParam: PasswordHistoryFirstTokenParams = {
    sortCriteria: getSortCriteriaFromSortingOptions(sortingOptions),
    filterCriteria: getFilterCriteria(
      activeFilter,
      searchValueToFetch,
      credentialId
    ),
  };
  const passwordHistoryItems: PaginatedEndpointResult<PasswordHistoryItemView> =
    usePaginatedEndpoint(
      {
        batchLiveEndpoint: carbonConnector.livePasswordHistoryBatch,
        pageEndpoint: carbonConnector.getPasswordHistoryPage,
        tokenEndpoint: carbonConnector.getPasswordHistoryPaginationToken,
        tokenEndpointParam: tokenQueryParam,
      },
      [sortingOptions, activeFilter, credentialId, searchValueToFetch]
    );
  if (passwordHistoryItems.status !== DataStatus.Loading) {
    passwordHistoryItemsRef.current = passwordHistoryItems;
  }
  const paginatedData =
    passwordHistoryItemsRef.current.status !== DataStatus.Success
      ? null
      : passwordHistoryItemsRef.current.data;
  return (
    <PersonalDataSectionView>
      <WithBaseLayout
        withLayout
        header={
          <>
            <PasswordHistoryHeader />
            {!interacted ? (
              <PasswordHistoryInfobox setAsInteracted={setAsInteracted} />
            ) : null}
          </>
        }
      >
        <Flex
          flexDirection="column"
          flexWrap="nowrap"
          sx={{
            position: "relative",
            overflow: "hidden",
            minWidth: "fit-content",
            maxWidth: "100%",
            minHeight: "85%",
            maxHeight: "100%",
          }}
        >
          {paginatedData ? (
            <PasswordHistoryDataView
              paginatedData={paginatedData}
              onSort={onSort}
              sortingOptions={sortingOptions}
              activeFilter={activeFilter}
              onFilterChanged={onFilterChanged}
              onPasswordCopied={onPasswordCopied}
              onSearchChange={onSearchChange}
              onClearSearchChange={onClearSearchChange}
              onCreateNewCredential={onCreateNewCredential}
              onOpenRestorePasswordDialog={onOpenRestorePasswordDialog}
              searchWasCleared={searchWasCleared}
              searchValue={searchValue}
            />
          ) : null}
        </Flex>
        {selectedItem && restorePasswordDialogOpen ? (
          <RestorePasswordDialog
            isOpen={restorePasswordDialogOpen}
            item={selectedItem}
            onCloseRestorePasswordDialog={onCloseRestorePasswordDialog}
            onPasswordRestored={onPasswordRestored}
          />
        ) : null}
        <PasswordLimitDialog
          isVisible={isPaywallVisible}
          handleDismiss={() => {
            setIsPaywallVisible(false);
          }}
        />
      </WithBaseLayout>
    </PersonalDataSectionView>
  );
};
export default PasswordHistory;
