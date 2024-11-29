import * as React from "react";
import { SharingUserView, SortDirection } from "@dashlane/communication";
import { InfiniteScrollList } from "../../../pagination/infinite-scroll-list";
import { SharingUsersHeader } from "./sharing-users-header";
import { SharingUsersRow } from "./sharing-users-row";
export interface SharingUsersListProps {
  sharingUsersWithItemCount: SharingUserView[];
  isSharingUsersWithItemCountLoading: boolean;
  updateUserSortDirection: (direction: SortDirection) => void;
  currentSortDirection: SortDirection;
  spaceId: string | null;
}
const WINDOW_SIZE = 30;
export const SharingUsersList = ({
  sharingUsersWithItemCount,
  isSharingUsersWithItemCountLoading,
  updateUserSortDirection,
  currentSortDirection,
  spaceId,
}: SharingUsersListProps) => {
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
    } else {
      setHasNextWindow(true);
    }
    setWindowEnd(newEnd);
  };
  return (
    <>
      <SharingUsersHeader
        updateUserSortDirection={updateUserSortDirection}
        currentSortDirection={currentSortDirection}
      />
      <InfiniteScrollList onNextPage={loadNextPage} hasMore={hasNextWindow}>
        {sharingUsers.slice(0, windowEnd).map(({ id, itemCount }) => {
          return (
            <SharingUsersRow key={id} userLogin={id} itemCount={itemCount} />
          );
        })}
      </InfiniteScrollList>
    </>
  );
};
