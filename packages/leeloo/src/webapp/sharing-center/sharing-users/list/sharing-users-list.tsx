import * as React from 'react';
import { SharingUserView, SortDirection } from '@dashlane/communication';
import { InfiniteScroll } from 'libs/pagination/infinite-scroll';
import { SharingUsersHeader } from 'webapp/sharing-center/sharing-users/list/sharing-users-header';
import { SharingUsersRow } from 'webapp/sharing-center/sharing-users/list/sharing-users-row';
export interface SharingUsersListProps {
    sharingUsersWithItemCount: SharingUserView[];
    isSharingUsersWithItemCountLoading: boolean;
    updateUserSortDirection: (direction: SortDirection) => void;
    currentSortDirection: SortDirection;
    scrollContainer?: React.RefObject<HTMLElement>;
    spaceId: string | null;
}
const WINDOW_SIZE = 30;
export const SharingUsersList = ({ sharingUsersWithItemCount, isSharingUsersWithItemCountLoading, updateUserSortDirection, currentSortDirection, scrollContainer, spaceId, }: SharingUsersListProps) => {
    const [windowEnd, setWindowEnd] = React.useState(WINDOW_SIZE);
    const [hasNextWindow, setHasNextWindow] = React.useState(true);
    const [sharingUsers, setSharingUsers] = React.useState<SharingUserView[]>([]);
    React.useEffect(() => {
        if (isSharingUsersWithItemCountLoading) {
            return;
        }
        setSharingUsers(sharingUsersWithItemCount);
    }, [sharingUsersWithItemCount, isSharingUsersWithItemCountLoading]);
    React.useEffect(() => {
        setWindowEnd(WINDOW_SIZE);
        setHasNextWindow(true);
    }, [spaceId]);
    const loadNextPage = () => {
        let newEnd = windowEnd + WINDOW_SIZE;
        if (newEnd + WINDOW_SIZE > sharingUsersWithItemCount.length) {
            newEnd = sharingUsersWithItemCount.length;
            setHasNextWindow(false);
        }
        else {
            setHasNextWindow(true);
        }
        setWindowEnd(newEnd);
    };
    const loadPreviousPage = () => {
    };
    return (<>
      <SharingUsersHeader updateUserSortDirection={updateUserSortDirection} currentSortDirection={currentSortDirection}/>
      <InfiniteScroll customContainer={scrollContainer} loadNext={loadNextPage} loadPrevious={loadPreviousPage} hasNext={hasNextWindow} hasPrevious={false} isLoading={isSharingUsersWithItemCountLoading}>
        {sharingUsers.slice(0, windowEnd).map(({ id, itemCount }) => {
            return (<SharingUsersRow key={id} userLogin={id} itemCount={itemCount}/>);
        })}
      </InfiniteScroll>
    </>);
};
