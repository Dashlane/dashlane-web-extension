import { useEffect, useMemo, useRef, useState } from 'react';
import { debounce } from 'lodash';
import { DataStatus, PaginatedEndpointResult, usePaginatedEndpoint, } from '@dashlane/carbon-api-consumers';
import { CredentialPasswordHistoryItemView, NotificationName, PasswordHistoryFirstTokenParams, PasswordHistoryItemView, } from '@dashlane/communication';
import { colors, FlexContainer, jsx } from '@dashlane/ui-components';
import { Action, Field, ItemType, PageView, Space, UserCopyVaultItemFieldEvent, UserUpdateVaultItemEvent, } from '@dashlane/hermes';
import { carbonConnector } from 'libs/carbon/connector';
import { useNotificationInteracted } from 'libs/carbon/hooks/useNotificationStatus';
import { logEvent, logPageView } from 'libs/logs/logEvent';
import { PASSWORD_HISTORY_LIST_SORT_PREFERENCES } from 'libs/localstorage-constants';
import { usePasswordLimitPaywall } from 'libs/paywall/paywallContext';
import { useHistory, useParams } from 'libs/router';
import { useRouterGlobalSettingsContext } from 'libs/router/RouterGlobalSettingsProvider';
import { OrderDir } from 'libs/sortHelper';
import { PasswordLimitDialog } from 'webapp/credentials/header/password-limit-dialog';
import { SortingOptions } from 'webapp/list-view/types';
import { PersonalDataSectionView } from 'webapp/personal-data-section-view/personal-data-section-view';
import { getFilterCriteria, getSortCriteriaFromSortingOptions, PasswordHistoryFilter, } from './list/helpers';
import { PasswordHistoryDataView } from './password-history-data-view';
import { PasswordHistoryHeader } from './password-history-header';
import { PasswordHistoryInfobox } from './password-history-infobox';
import { RestorePasswordDialog } from './password-history-restore-dialog';
import { PasswordCopyHandlerParams, PasswordHistoryRouteParams } from './types';
import { QuickActionAlert } from './quick-action-alert';
const I18N_KEYS = {
    COPY_PASSWORD_ERROR: 'webapp_credentials_quick_actions_copy_password_feedback_not_ok',
    COPY_PASSWORD_OK: 'webapp_password_history_quick_action_copy_password_success_message',
    RESTORE_PASSWORD_OK: 'webapp_password_history_quick_action_restore_password_success_message',
    RESTORE_PASSWORD_ERROR: '_common_generic_error',
};
const DEBOUNCE_DELAY_MS = 100;
const PasswordHistory = () => {
    const usePasswordLimitResult = usePasswordLimitPaywall();
    const shouldShowAtOrOverLimitContent = !usePasswordLimitResult.isLoading &&
        usePasswordLimitResult.shouldShowAtOrOverLimitContent;
    const { routes } = useRouterGlobalSettingsContext();
    const history = useHistory();
    const [sortingOptions, setSortingOptions] = useState<SortingOptions>({
        field: 'timestamp',
        direction: OrderDir.descending,
    });
    const { interacted, setAsInteracted } = useNotificationInteracted(NotificationName.PasswordHistoryBanner);
    const [activeFilter, setActiveFilter] = useState<PasswordHistoryFilter>(PasswordHistoryFilter.All);
    const [searchValue, setSearchValue] = useState('');
    const [searchValueToFetch, setSearchValueToFetch] = useState('');
    const [searchWasCleared, setSearchWasCleared] = useState(false);
    const [isPaywallVisible, setIsPaywallVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState<CredentialPasswordHistoryItemView | undefined>();
    const [restorePasswordDialogOpen, setRestorePasswordDialogOpen] = useState(false);
    const [showPasswordRestoredAlert, setPasswordRestoredAlert] = useState(false);
    const [passwordRestoredSuccess, setPasswordRestoredSuccess] = useState(true);
    const [passwordRestoredTimeout, setPasswordRestoredTimeout] = useState(0);
    const [showPasswordCopiedAlert, setPasswordCopiedAlert] = useState(false);
    const [passwordCopiedSuccess, setPasswordCopiedSuccess] = useState(true);
    const [passwordCopiedTimeout, setPasswordCopiedTimeout] = useState(0);
    const { credentialId } = useParams<PasswordHistoryRouteParams>();
    const passwordHistoryItemsRef = useRef<PaginatedEndpointResult<PasswordHistoryItemView>>({ status: DataStatus.Loading });
    const restoreFromStorage = () => {
        const preferences = localStorage.getItem(PASSWORD_HISTORY_LIST_SORT_PREFERENCES);
        try {
            if (preferences) {
                const storedSorting = JSON.parse(preferences);
                setSortingOptions(storedSorting);
            }
        }
        catch (err) {
        }
    };
    useEffect(() => {
        logPageView(PageView.PasswordHistory);
        restoreFromStorage();
        return () => {
            window.clearTimeout(passwordRestoredTimeout);
            window.clearTimeout(passwordCopiedTimeout);
        };
    }, []);
    const onSaveToStorage = (newSortingOptions: SortingOptions) => {
        localStorage.setItem(PASSWORD_HISTORY_LIST_SORT_PREFERENCES, JSON.stringify(newSortingOptions));
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
    const onPasswordCopied = ({ success, isProtected, itemId, }: PasswordCopyHandlerParams) => {
        if (passwordCopiedTimeout) {
            window.clearTimeout(passwordCopiedTimeout);
        }
        setPasswordCopiedAlert(true);
        setPasswordCopiedSuccess(success);
        setPasswordCopiedTimeout(window.setTimeout(() => {
            setPasswordCopiedAlert(false);
        }, 5000));
        logEvent(new UserCopyVaultItemFieldEvent({
            field: Field.Password,
            isProtected,
            itemType: ItemType.Credential,
            itemId,
        }));
    };
    const onPasswordRestored = (item: CredentialPasswordHistoryItemView, success: boolean) => {
        if (passwordRestoredTimeout) {
            window.clearTimeout(passwordRestoredTimeout);
        }
        setPasswordRestoredAlert(true);
        setPasswordRestoredSuccess(success);
        setPasswordRestoredTimeout(window.setTimeout(() => {
            setPasswordRestoredAlert(false);
        }, 5000));
        if (success) {
            logEvent(new UserUpdateVaultItemEvent({
                action: Action.Edit,
                itemId: item.credentialId,
                itemType: ItemType.Credential,
                space: item.spaceId ? Space.Professional : Space.Personal,
            }));
        }
        setSelectedItem(undefined);
    };
    const onOpenRestorePasswordDialog = (newSelectedItem: CredentialPasswordHistoryItemView) => {
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
        setSearchValue('');
        setSearchValueToFetch('');
        setSearchWasCleared(true);
    };
    const onCreateNewCredential = (generatedPassword: string, website?: string) => {
        if (shouldShowAtOrOverLimitContent) {
            setIsPaywallVisible(true);
        }
        else {
            history.push(routes.userAddWebsiteCredentialWithPrefilledParameters({
                website: website ?? '',
                previouslyGeneratedPassword: generatedPassword,
            }));
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
        filterCriteria: getFilterCriteria(activeFilter, searchValueToFetch, credentialId),
    };
    const passwordHistoryItems: PaginatedEndpointResult<PasswordHistoryItemView> = usePaginatedEndpoint({
        batchLiveEndpoint: carbonConnector.livePasswordHistoryBatch,
        pageEndpoint: carbonConnector.getPasswordHistoryPage,
        tokenEndpoint: carbonConnector.getPasswordHistoryPaginationToken,
        tokenEndpointParam: tokenQueryParam,
    }, [sortingOptions, activeFilter, credentialId, searchValueToFetch]);
    if (passwordHistoryItems.status !== DataStatus.Loading) {
        passwordHistoryItemsRef.current = passwordHistoryItems;
    }
    const paginatedData = passwordHistoryItemsRef.current.status !== DataStatus.Success
        ? null
        : passwordHistoryItemsRef.current.data;
    return (<PersonalDataSectionView>
      <FlexContainer fullWidth flexDirection="column" flexWrap="nowrap" sx={{
            height: '100%',
            overflow: 'auto',
            bg: colors.dashGreen06,
        }}>
        <PasswordHistoryHeader />
        {!interacted ? (<PasswordHistoryInfobox setAsInteracted={setAsInteracted}/>) : null}
        <FlexContainer flexDirection="column" flexWrap="nowrap" sx={{
            position: 'relative',
            overflow: 'hidden',
            minWidth: 'fit-content',
            maxWidth: '100%',
            minHeight: '85%',
            maxHeight: '100%',
            bg: 'white',
            borderColor: colors.dashGreen05,
            borderStyle: 'solid',
            borderWidth: 'thin',
            mx: '32px',
        }}>
          {paginatedData ? (<PasswordHistoryDataView paginatedData={paginatedData} onSort={onSort} sortingOptions={sortingOptions} activeFilter={activeFilter} onFilterChanged={onFilterChanged} onPasswordCopied={onPasswordCopied} onSearchChange={onSearchChange} onClearSearchChange={onClearSearchChange} onCreateNewCredential={onCreateNewCredential} onOpenRestorePasswordDialog={onOpenRestorePasswordDialog} searchWasCleared={searchWasCleared} searchValue={searchValue}/>) :
            null}
        </FlexContainer>
        {showPasswordCopiedAlert ? (<QuickActionAlert success={passwordCopiedSuccess} successMessage={I18N_KEYS.COPY_PASSWORD_OK} errorMessage={I18N_KEYS.COPY_PASSWORD_ERROR} onClose={() => setPasswordCopiedAlert(false)}/>) : null}
        {showPasswordRestoredAlert ? (<QuickActionAlert success={passwordRestoredSuccess} successMessage={I18N_KEYS.RESTORE_PASSWORD_OK} errorMessage={I18N_KEYS.RESTORE_PASSWORD_ERROR} onClose={() => setPasswordRestoredAlert(false)}/>) : null}
        {selectedItem && restorePasswordDialogOpen ? (<RestorePasswordDialog isOpen={restorePasswordDialogOpen} item={selectedItem} onCloseRestorePasswordDialog={onCloseRestorePasswordDialog} onPasswordRestored={onPasswordRestored}/>) : null}
        <PasswordLimitDialog isVisible={isPaywallVisible} handleDismiss={() => {
            setIsPaywallVisible(false);
        }}/>
      </FlexContainer>
    </PersonalDataSectionView>);
};
export default PasswordHistory;
