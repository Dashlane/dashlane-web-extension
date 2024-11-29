import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { NotificationName } from "@dashlane/communication";
import { PageView } from "@dashlane/hermes";
import { FEATURE_FLIPS_WITHOUT_MODULE } from "@dashlane/framework-dashlane-application";
import { useFeatureFlip } from "@dashlane/framework-react";
import { SortDirection } from "@dashlane/sharing-contracts";
import { Button, InfoBox } from "@dashlane/ui-components";
import { useNotificationSeen } from "../../libs/carbon/hooks/useNotificationStatus";
import {
  SHARING_GROUP_LIST_SORT_PREFERENCE,
  SHARING_USER_LIST_SORT_PREFERENCE,
} from "../../libs/localstorage-constants";
import LoadingSpinner from "../../libs/dashlane-style/loading-spinner";
import { GroupList } from "./group/list/group-list";
import { EmptyView } from "../empty-view/empty-view";
import { SharingUsersList } from "./sharing-users/list/sharing-users-list";
import { TopMenu } from "./layout/top-menu/top-menu";
import { EmptyList } from "./empty-list/empty-list";
import { useIsSharingEnabled } from "../../libs/carbon/hooks/useIsSharingEnabled";
import { useSharingUsers } from "./sharing-users/useSharingUsers";
import { useUserGroups } from "./group/useUserGroups";
import useTranslate from "../../libs/i18n/useTranslate";
import { useTeamSpaceContext } from "../../team/settings/components/TeamSpaceContext";
import { UpgradeDialog } from "./upgrade-dialog/upgrade-dialog";
import { logPageView } from "../../libs/logs/logEvent";
import { BaseLayout } from "../layout/base-layout";
import { EmptyStateHeader } from "../empty-state/shared/empty-state-header";
import { SharingCenterEmptyState } from "./empty-state/sharing-center-empty-state";
export interface SharingCenterProps {
  children: ReactNode;
}
const I18N_KEYS = {
  TITLE: "team_sharing_disabled_banner_title",
  DESCRIPTION: "team_sharing_disabled_banner_description",
  DISMISS: "team_sharing_disabled_banner_dismiss_cta",
  EMPTY_STATE_PAGE_TITLE: "webapp_sharing_center_empty_state_page_title",
};
const isOfSortDirectionType = (value: string | null): value is SortDirection =>
  value === "ascend" || value === "descend";
const saveSortDirection = (key: string, value: SortDirection) => {
  localStorage.setItem(key, value);
};
const restoreStoreDirection = (key: string): SortDirection => {
  const sortDirection = localStorage.getItem(key);
  if (isOfSortDirectionType(sortDirection)) {
    return sortDirection;
  }
  return SortDirection.Ascend;
};
export const SharingCenterCarbon = ({ children }: SharingCenterProps) => {
  const { currentSpaceId } = useTeamSpaceContext();
  const scrollContainer = useRef(null);
  const emptyStateBatch3FeatureFlip = useFeatureFlip(
    FEATURE_FLIPS_WITHOUT_MODULE.EmptyStateBatch3
  );
  const { translate } = useTranslate();
  const sharingEnabledResult = useIsSharingEnabled();
  const isSharingEnabledLoaded =
    sharingEnabledResult.status === DataStatus.Success;
  const isSharingEnabled = sharingEnabledResult.data;
  const { unseen, setAsSeen } = useNotificationSeen(
    NotificationName.SharingCenterDisabledBanner
  );
  const [hasGroupData, setHasGroupData] = useState(false);
  const [hasUserData, setHasUserData] = useState(false);
  const [groupSortDirection, setGroupSortDirection] = useState<SortDirection>(
    restoreStoreDirection(SHARING_GROUP_LIST_SORT_PREFERENCE)
  );
  const userGroups = useUserGroups(groupSortDirection, currentSpaceId);
  const updateGroupSortDirection = useCallback((direction: SortDirection) => {
    saveSortDirection(SHARING_GROUP_LIST_SORT_PREFERENCE, direction);
    setGroupSortDirection(direction);
  }, []);
  const [userSortDirection, setUsersSortDirection] = useState<SortDirection>(
    restoreStoreDirection(SHARING_USER_LIST_SORT_PREFERENCE)
  );
  const sharingUsers = useSharingUsers(userSortDirection, currentSpaceId);
  const updateUserSortDirection = useCallback((direction: SortDirection) => {
    saveSortDirection(SHARING_USER_LIST_SORT_PREFERENCE, direction);
    setUsersSortDirection(direction);
  }, []);
  useEffect(() => {
    logPageView(PageView.SharingList);
  }, []);
  useEffect(() => {
    if (userGroups.status !== DataStatus.Success) {
      return;
    }
    setHasGroupData(userGroups.data.items.length !== 0);
  }, [userGroups]);
  useEffect(() => {
    if (sharingUsers.status !== DataStatus.Success) {
      return;
    }
    setHasUserData(sharingUsers.data.length !== 0);
  }, [sharingUsers]);
  const emptyStateHeader = emptyStateBatch3FeatureFlip ? (
    <EmptyStateHeader title={I18N_KEYS.EMPTY_STATE_PAGE_TITLE} />
  ) : (
    <TopMenu />
  );
  if (
    (sharingUsers.status === DataStatus.Loading ||
      userGroups.status === DataStatus.Loading) &&
    !hasGroupData &&
    !hasUserData
  ) {
    return (
      <BaseLayout header={emptyStateHeader}>
        <EmptyView icon={<LoadingSpinner size={50} />} title="" />
      </BaseLayout>
    );
  }
  const hasData = hasGroupData || hasUserData;
  return (
    <BaseLayout header={hasData ? <TopMenu /> : emptyStateHeader}>
      {children}

      <div
        sx={{
          display: "flex",
          gap: "16px",
          justifyContent: hasData ? "start" : "center",
          minHeight: "100%",
        }}
      >
        {hasData ? (
          <div sx={{ width: "100%" }} ref={scrollContainer}>
            <div
              sx={{
                display: "grid",
                gridTemplateColumns: "auto",
              }}
            >
              {!isSharingEnabled && unseen && isSharingEnabledLoaded ? (
                <InfoBox
                  severity="warning"
                  size="descriptive"
                  layout="inline"
                  title={<strong>{translate(I18N_KEYS.TITLE)}</strong>}
                  actions={[
                    <Button
                      type="button"
                      nature="secondary"
                      key="dismiss"
                      onClick={setAsSeen}
                    >
                      {translate(I18N_KEYS.DISMISS)}
                    </Button>,
                  ]}
                  sx={{ margin: "0 32px" }}
                >
                  {translate(I18N_KEYS.DESCRIPTION)}
                </InfoBox>
              ) : null}
              {hasGroupData ? (
                <GroupList
                  userGroups={
                    userGroups.status === DataStatus.Success
                      ? userGroups.data.items
                      : []
                  }
                  isGroupsWithItemCountLoading={
                    userGroups.status === DataStatus.Loading
                  }
                  updateGroupSortDirection={updateGroupSortDirection}
                  currentSortDirection={groupSortDirection}
                />
              ) : null}
              {hasUserData ? (
                <SharingUsersList
                  sharingUsersWithItemCount={
                    sharingUsers.status === DataStatus.Success
                      ? sharingUsers.data
                      : []
                  }
                  isSharingUsersWithItemCountLoading={
                    sharingUsers.status === DataStatus.Loading
                  }
                  updateUserSortDirection={updateUserSortDirection}
                  currentSortDirection={userSortDirection}
                  spaceId={currentSpaceId}
                />
              ) : null}
            </div>
          </div>
        ) : emptyStateBatch3FeatureFlip ? (
          <SharingCenterEmptyState />
        ) : (
          <EmptyList />
        )}
        <UpgradeDialog
          hasSharedUsers={
            sharingUsers.status === DataStatus.Success
              ? !!sharingUsers.data.length
              : false
          }
        />
      </div>
    </BaseLayout>
  );
};
