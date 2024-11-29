import * as React from "react";
import { SortDirection, UserGroupSortField } from "@dashlane/communication";
import { OrderDir } from "../../../../libs/sortHelper";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { Header } from "../../../list-view/header";
import { SortingOptions } from "../../../list-view/types";
import styles from "./group-list-styles.css";
const I18N_KEYS = {
  GROUPS: "webapp_sharing_center_group_row_group_title",
  NUMBER_OF_SHARED: "webapp_sharing_center_row_items_title",
  MEMBERS: "webapp_sharing_center_group_row_members_title",
};
export interface GroupHeaderProps {
  updateGroupSortDirection: (direction: SortDirection) => void;
  currentSortDirection: SortDirection;
}
export const GroupHeader = ({
  updateGroupSortDirection,
  currentSortDirection,
}: GroupHeaderProps) => {
  const { translate } = useTranslate();
  const headerFields = [
    {
      key: "name",
      sortable: true,
      content: translate(I18N_KEYS.GROUPS),
    },
    {
      key: "itemsShared",
      sortable: false,
      content: translate(I18N_KEYS.NUMBER_OF_SHARED),
      className: styles.groupListRowCellItems,
    },
    {
      key: "members",
      sortable: false,
      content: translate(I18N_KEYS.MEMBERS),
      className: styles.groupListCellMembers,
    },
  ];
  const getHeaderSortOptions = () => {
    let orderDir = OrderDir.ascending;
    if (currentSortDirection === "descend") {
      orderDir = OrderDir.descending;
    }
    return {
      field: "name",
      direction: orderDir,
    };
  };
  const onSort = React.useCallback(
    (sortingOptions: SortingOptions<UserGroupSortField>) => {
      let newSortDirection: SortDirection = "ascend";
      if (sortingOptions.direction === OrderDir.descending) {
        newSortDirection = "descend";
      }
      updateGroupSortDirection(newSortDirection);
    },
    [updateGroupSortDirection]
  );
  return (
    <div className={styles.groupHeader}>
      <Header
        header={headerFields}
        onSort={onSort}
        options={getHeaderSortOptions()}
      />
    </div>
  );
};
