import * as React from 'react';
import { DataStatus } from '@dashlane/carbon-api-consumers';
import { NotificationName, SortDirection } from '@dashlane/communication';
import { Button, InfoBox, jsx } from '@dashlane/ui-components';
import { useNotificationSeen } from 'libs/carbon/hooks/useNotificationStatus';
import { SHARING_GROUP_LIST_SORT_PREFERENCE, SHARING_USER_LIST_SORT_PREFERENCE, } from 'libs/localstorage-constants';
import LoadingSpinner from 'libs/dashlane-style/loading-spinner';
import { GroupList } from 'webapp/sharing-center/group/list/group-list';
import { EmptyView } from 'webapp/empty-view/empty-view';
import { SharingUsersList } from 'webapp/sharing-center/sharing-users/list/sharing-users-list';
import { TopMenu } from 'webapp/sharing-center/layout/top-menu/top-menu';
import { EmptyList } from 'webapp/sharing-center/empty-list/empty-list';
import { useIsSharingEnabled } from 'libs/carbon/hooks/useIsSharingEnabled';
import { useSharingUsers } from './sharing-users/useSharingUsers';
import { useUserGroups } from './group/useUserGroups';
import useTranslate from 'libs/i18n/useTranslate';
import { useTeamSpaceContext } from 'team/settings/components/TeamSpaceContext';
import { UpgradeDialog } from './upgrade-dialog/upgrade-dialog';
import { logPageView } from 'libs/logs/logEvent';
import { PageView } from '@dashlane/hermes';
export interface SharingCenterProps {
    children: React.ReactNode;
}
const I18N_KEYS = {
    TITLE: 'team_sharing_disabled_banner_title',
    DESCRIPTION: 'team_sharing_disabled_banner_description',
    DISMISS: 'team_sharing_disabled_banner_dismiss_cta',
};
const isOfSortDirectionType = (value: string | null): value is SortDirection => value === 'ascend' || value === 'descend';
const saveSortDirection = (key: string, value: SortDirection) => {
    localStorage.setItem(key, value);
};
const restoreStoreDirection = (key: string): SortDirection => {
    const sortDirection = localStorage.getItem(key);
    if (isOfSortDirectionType(sortDirection)) {
        return sortDirection;
    }
    return 'ascend';
};
export const SharingCenter = ({ children }: SharingCenterProps) => {
    const { currentSpaceId } = useTeamSpaceContext();
    const scrollContainer = React.useRef(null);
    const { translate } = useTranslate();
    const sharingEnabledResult = useIsSharingEnabled();
    const isSharingEnabledLoaded = sharingEnabledResult.status === DataStatus.Success;
    const isSharingEnabled = sharingEnabledResult.data;
    const { unseen, setAsSeen } = useNotificationSeen(NotificationName.SharingCenterDisabledBanner);
    const [hasGroupData, setHasGroupData] = React.useState(false);
    const [hasUserData, setHasUserData] = React.useState(false);
    const [groupSortDirection, setGroupSortDirection] = React.useState<SortDirection>(restoreStoreDirection(SHARING_GROUP_LIST_SORT_PREFERENCE));
    const userGroups = useUserGroups(groupSortDirection, currentSpaceId);
    const updateGroupSortDirection = React.useCallback((direction: SortDirection) => {
        saveSortDirection(SHARING_GROUP_LIST_SORT_PREFERENCE, direction);
        setGroupSortDirection(direction);
    }, []);
    const [userSortDirection, setUsersSortDirection] = React.useState<SortDirection>(restoreStoreDirection(SHARING_USER_LIST_SORT_PREFERENCE));
    const sharingUsers = useSharingUsers(userSortDirection, currentSpaceId);
    const updateUserSortDirection = React.useCallback((direction: SortDirection) => {
        saveSortDirection(SHARING_USER_LIST_SORT_PREFERENCE, direction);
        setUsersSortDirection(direction);
    }, []);
    React.useEffect(() => {
        logPageView(PageView.SharingList);
    }, []);
    React.useEffect(() => {
        if (userGroups.status !== DataStatus.Success) {
            return;
        }
        setHasGroupData(userGroups.data.items.length !== 0);
    }, [userGroups]);
    React.useEffect(() => {
        if (sharingUsers.status !== DataStatus.Success) {
            return;
        }
        setHasUserData(sharingUsers.data.items.length !== 0);
    }, [sharingUsers]);
    if ((sharingUsers.status === DataStatus.Loading ||
        userGroups.status === DataStatus.Loading) &&
        !hasGroupData &&
        !hasUserData) {
        return <EmptyView icon={<LoadingSpinner size={50}/>} title=""/>;
    }
    return (<div sx={{ overflowY: 'auto', height: '100%' }}>
      <div>
        {children}
        <TopMenu />
        <div sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          {hasUserData || hasGroupData ? (<div sx={{ width: '100%' }} ref={scrollContainer}>
              <div sx={{
                backgroundColor: 'ds.background.default',
                display: 'grid',
                gridTemplateColumns: 'auto',
            }}>
                {!isSharingEnabled && unseen && isSharingEnabledLoaded ? (<InfoBox severity="warning" size="descriptive" layout="inline" title={<strong>{translate(I18N_KEYS.TITLE)}</strong>} actions={[
                    <Button type="button" nature="secondary" key="dismiss" onClick={setAsSeen}>
                        {translate(I18N_KEYS.DISMISS)}
                      </Button>,
                ]} sx={{ margin: '0 32px' }}>
                    {translate(I18N_KEYS.DESCRIPTION)}
                  </InfoBox>) : null}
                {hasGroupData ? (<GroupList userGroups={userGroups.status === DataStatus.Success
                    ? userGroups.data.items
                    : []} isGroupsWithItemCountLoading={userGroups.status === DataStatus.Loading} updateGroupSortDirection={updateGroupSortDirection} currentSortDirection={groupSortDirection}/>) : null}
                {hasUserData ? (<SharingUsersList sharingUsersWithItemCount={sharingUsers.status === DataStatus.Success
                    ? sharingUsers.data.items
                    : []} isSharingUsersWithItemCountLoading={sharingUsers.status === DataStatus.Loading} updateUserSortDirection={updateUserSortDirection} currentSortDirection={userSortDirection} scrollContainer={scrollContainer} spaceId={currentSpaceId}/>) : null}
              </div>
            </div>) : (<EmptyList />)}
          <UpgradeDialog hasSharedUsers={sharingUsers.status === DataStatus.Success
            ? !!sharingUsers.data.items.length
            : false}/>
        </div>
      </div>
    </div>);
};
