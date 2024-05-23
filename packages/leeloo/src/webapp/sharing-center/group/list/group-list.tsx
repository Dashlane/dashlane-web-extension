import * as React from 'react';
import { SortDirection, UserGroupView } from '@dashlane/communication';
import { Button } from '@dashlane/design-system';
import useTranslate from 'libs/i18n/useTranslate';
import { GroupRow } from 'webapp/sharing-center/group/list/group-row';
import { GroupHeader } from 'webapp/sharing-center/group/list/group-header';
import styles from './group-list-styles.css';
const I18N_KEYS = {
    SEE_MORE: 'webapp_sharing_center_group_pagination',
};
export interface GroupListProps {
    userGroups: UserGroupView[];
    isGroupsWithItemCountLoading: boolean;
    updateGroupSortDirection: (direction: SortDirection) => void;
    currentSortDirection: SortDirection;
}
const INITIAL_ROW_COUNT = 5;
const ROW_PAGE_COUNT = 10;
export const GroupList = ({ userGroups, updateGroupSortDirection, currentSortDirection, isGroupsWithItemCountLoading, }: GroupListProps) => {
    const { translate } = useTranslate();
    const [displayShowMoreButton, setDisplayShowMoreButton] = React.useState(userGroups.length > INITIAL_ROW_COUNT);
    const [maxRows, setMaxRows] = React.useState(INITIAL_ROW_COUNT);
    const [groups, setGroups] = React.useState<UserGroupView[]>([]);
    const isResorting = React.useRef(false);
    React.useEffect(() => {
        if (isGroupsWithItemCountLoading) {
            return;
        }
        setGroups(userGroups);
        if (isResorting.current) {
            isResorting.current = false;
            return;
        }
        setDisplayShowMoreButton(userGroups.length > INITIAL_ROW_COUNT);
        setMaxRows(INITIAL_ROW_COUNT);
    }, [userGroups, isGroupsWithItemCountLoading]);
    const onShowMoreButtonClicked = React.useCallback(() => {
        const newMaxRows = maxRows + ROW_PAGE_COUNT;
        if (newMaxRows < userGroups.length) {
            setDisplayShowMoreButton(true);
            setMaxRows((prevMaxRows) => prevMaxRows + ROW_PAGE_COUNT);
        }
        else {
            setDisplayShowMoreButton(false);
            setMaxRows(userGroups.length);
        }
    }, [userGroups, maxRows]);
    const onResort = React.useCallback((direction: SortDirection) => {
        isResorting.current = true;
        updateGroupSortDirection(direction);
    }, [updateGroupSortDirection]);
    return (<>
      <GroupHeader updateGroupSortDirection={onResort} currentSortDirection={currentSortDirection}/>
      <ul className={styles.groupList}>
        {groups.slice(0, maxRows).map((group) => (<GroupRow key={group.id} group={group} itemCount={group.itemCount}/>))}
      </ul>
      {displayShowMoreButton ? (<div className={styles.showMoreButton}>
          <Button intensity="quiet" mood="neutral" size="medium" onClick={onShowMoreButtonClicked}>
            {translate(I18N_KEYS.SEE_MORE)}
          </Button>
        </div>) : null}
    </>);
};
