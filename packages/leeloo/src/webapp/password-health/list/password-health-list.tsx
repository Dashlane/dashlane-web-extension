import { memo, useCallback, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  DSStyleObject,
  Heading,
  TabConfiguration,
  Tabs,
} from "@dashlane/design-system";
import {
  Action,
  ItemType,
  PageView,
  Space,
  UserUpdateVaultItemEvent,
} from "@dashlane/hermes";
import { useModuleCommands } from "@dashlane/framework-react";
import {
  HealthFilter,
  passwordHealthApi,
  PasswordHealthCredentialView,
} from "@dashlane/password-security-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { logEvent, logPageView } from "../../../libs/logs/logEvent";
import { logSelectCredential } from "../../../libs/logs/events/vault/select-item";
import { PasswordHealthListItem } from "./list-item/password-health-list-item";
import { EmptyList } from "./empty-list/empty-list";
import { PasswordChangeDialog } from "../../password-change-dialog/components/dialogs/password-change-dialog";
import { useIsCredentialExcluded } from "../hooks/use-is-credential-excluded";
import { useCredentialsFilter } from "../hooks/use-credentials-filter";
import { passwordHealthStyles } from "../password-health-styles";
import { useRouterGlobalSettingsContext } from "../../../libs/router";
import { InfiniteScrollList } from "../../pagination/infinite-scroll-list";
const I18N_KEYS = {
  AT_RISK_TITLE: "webapp_password_health_at_risk_title",
  FILTER_ALL: "webapp_password_health_list_filter_all",
  FILTER_COMPROMISED: "webapp_password_health_list_filter_compromised",
  FILTER_EXCLUDED: "webapp_password_health_list_filter_excluded",
  FILTER_REUSED: "webapp_password_health_list_filter_reused",
  FILTER_WEAK: "webapp_password_health_list_filter_weak",
  LOAD_MORE: "webapp_password_health_list_load_more",
};
const filterToPageView: Record<HealthFilter, PageView> = {
  [HealthFilter.All]: PageView.ToolsPasswordHealthOverview,
  [HealthFilter.Compromised]: PageView.ToolsPasswordHealthListCompromised,
  [HealthFilter.Excluded]: PageView.ToolsPasswordHealthListExcluded,
  [HealthFilter.Reused]: PageView.ToolsPasswordHealthListReused,
  [HealthFilter.Weak]: PageView.ToolsPasswordHealthListWeak,
};
interface PasswordHealthListProps {
  spaceId: string | null;
}
export type PasswordHealthRouteParams = {
  filter: HealthFilter | undefined;
};
const MenuFiltersStyles: DSStyleObject = {
  marginLeft: "auto",
};
const tabIndexes = [
  HealthFilter.All,
  HealthFilter.Compromised,
  HealthFilter.Weak,
  HealthFilter.Reused,
  HealthFilter.Excluded,
];
const MemoizedPasswordHealthListItem = memo(PasswordHealthListItem);
export const PasswordHealthList = ({ spaceId }: PasswordHealthListProps) => {
  const { translate } = useTranslate();
  const { updateIsCredentialExcluded } = useIsCredentialExcluded();
  const { updateHealthState } = useModuleCommands(passwordHealthApi);
  const { routes } = useRouterGlobalSettingsContext();
  const history = useHistory();
  const { filter } = useParams<PasswordHealthRouteParams>();
  const hasInitialFilter =
    filter && Object.values(HealthFilter).includes(filter);
  const initialfilter = hasInitialFilter ? filter : HealthFilter.All;
  const [activeFilter, setActiveFilter] = useState<HealthFilter>(initialfilter);
  const { filteredCredentials, hasMore, onNextPage, onReset } =
    useCredentialsFilter(activeFilter, spaceId);
  useEffect(() => {
    updateHealthState();
  }, [history.location]);
  const getChangeFilterCallback = (updatedHealthFilter: HealthFilter) => () => {
    onReset();
    setActiveFilter(updatedHealthFilter);
    history.push(`${routes.userPasswordHealth}/${updatedHealthFilter}`);
    logPageView(filterToPageView[updatedHealthFilter]);
  };
  const [passwordChangeCredentialId, setPasswordChangeCredentialId] = useState<
    null | string
  >(null);
  const openPasswordChange = useCallback(
    (credentialID) => setPasswordChangeCredentialId(credentialID),
    []
  );
  const closePasswordChange = useCallback(() => {
    setPasswordChangeCredentialId(null);
  }, []);
  const onRowClick = useCallback((credentialId: string) => {
    logSelectCredential(credentialId);
  }, []);
  const onChangeNowClick = useCallback(
    (website: string, credentialID: string) => {
      openPasswordChange(credentialID);
    },
    [openPasswordChange]
  );
  const onIncludeButtonClick = useCallback(
    (credentialId: string) => {
      updateIsCredentialExcluded(credentialId, false);
    },
    [updateIsCredentialExcluded]
  );
  const onExcludeButtonClick = useCallback(
    (credentialId: string) => {
      logEvent(
        new UserUpdateVaultItemEvent({
          action: Action.ExcludeItemFromPasswordHealth,
          itemId: credentialId,
          itemType: ItemType.Credential,
          space: spaceId ? Space.Professional : Space.Personal,
        })
      );
      updateIsCredentialExcluded(credentialId, true);
    },
    [spaceId, updateIsCredentialExcluded]
  );
  const tabs: TabConfiguration[] = [
    {
      id: "tab-ph-all",
      contentId: "content-ph-list",
      title: translate(I18N_KEYS.FILTER_ALL),
      onSelect: getChangeFilterCallback(HealthFilter.All),
    },
    {
      id: "tab-ph-compromised",
      contentId: "content-ph-list",
      title: translate(I18N_KEYS.FILTER_COMPROMISED),
      onSelect: getChangeFilterCallback(HealthFilter.Compromised),
    },
    {
      id: "tab-ph-weak",
      contentId: "content-ph-list",
      title: translate(I18N_KEYS.FILTER_WEAK),
      onSelect: getChangeFilterCallback(HealthFilter.Weak),
    },
    {
      id: "tab-ph-reused",
      contentId: "content-ph-list",
      title: translate(I18N_KEYS.FILTER_REUSED),
      onSelect: getChangeFilterCallback(HealthFilter.Reused),
    },
    {
      id: "tab-ph-excluded",
      contentId: "content-ph-list",
      title: translate(I18N_KEYS.FILTER_EXCLUDED),
      onSelect: getChangeFilterCallback(HealthFilter.Excluded),
    },
  ];
  return (
    <>
      <div
        sx={{
          ...passwordHealthStyles.listHeader,
          display: "flex",
          position: "sticky",
          alignItems: "center",
        }}
      >
        <Heading
          as="h2"
          color="ds.text.neutral.quiet"
          textStyle="ds.title.supporting.small"
        >
          {translate(I18N_KEYS.AT_RISK_TITLE)}
        </Heading>
        {passwordChangeCredentialId && (
          <PasswordChangeDialog
            credentialId={passwordChangeCredentialId}
            dismissCallback={closePasswordChange}
          />
        )}
        <Tabs
          tabs={tabs}
          sx={MenuFiltersStyles}
          defaultTab={tabIndexes.indexOf(initialfilter)}
        />
      </div>
      <div
        sx={{
          ...passwordHealthStyles.listContainer,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {filteredCredentials.length > 0 ? (
          <ul
            sx={passwordHealthStyles.listStyle}
            aria-labelledby="content-ph-list"
          >
            <InfiniteScrollList onNextPage={onNextPage} hasMore={hasMore}>
              {filteredCredentials.map(
                (credential: PasswordHealthCredentialView) => (
                  <MemoizedPasswordHealthListItem
                    onRowClick={onRowClick}
                    onChangeNowClick={onChangeNowClick}
                    onIncludeButtonClick={onIncludeButtonClick}
                    onExcludeButtonClick={onExcludeButtonClick}
                    key={credential.id}
                    credential={credential}
                  />
                )
              )}
            </InfiniteScrollList>
          </ul>
        ) : (
          <EmptyList healthFilter={activeFilter} spaceId={spaceId} />
        )}
      </div>
    </>
  );
};
