import * as React from "react";
import { SharingUserSortField, SortDirection } from "@dashlane/communication";
import { OrderDir } from "../../../../libs/sortHelper";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { SortingOptions } from "../../../list-view/types";
import { Header as ListHeader } from "../../../list-view/header";
import styles from "./sharing-users-list.css";
const I18N_KEYS = {
  PEOPLE: "webapp_sharing_center_member_row_member_title",
  NUMBER_OF_SHARED: "webapp_sharing_center_row_items_title",
};
export interface SharingUsersHeaderProps {
  updateUserSortDirection: (direction: SortDirection) => void;
  currentSortDirection: SortDirection;
}
export const SharingUsersHeader = ({
  updateUserSortDirection,
  currentSortDirection,
}: SharingUsersHeaderProps) => {
  const { translate } = useTranslate();
  const headerFields = [
    {
      key: "userId",
      sortable: true,
      content: translate(I18N_KEYS.PEOPLE),
    },
    {
      key: "itemsShared",
      sortable: false,
      content: translate(I18N_KEYS.NUMBER_OF_SHARED),
      className: styles.itemsShared,
    },
  ];
  const getHeaderSortOptions = () => {
    let orderDir = OrderDir.ascending;
    if (currentSortDirection === "descend") {
      orderDir = OrderDir.descending;
    }
    return {
      field: "userId",
      direction: orderDir,
    };
  };
  const onSort = (sortingOptions: SortingOptions<SharingUserSortField>) => {
    let newSortDirection: SortDirection = "ascend";
    if (sortingOptions.direction === OrderDir.descending) {
      newSortDirection = "descend";
    }
    updateUserSortDirection(newSortDirection);
  };
  return (
    <div className={styles.contentHeader}>
      <ListHeader
        header={headerFields}
        onSort={onSort}
        options={getHeaderSortOptions()}
      />
    </div>
  );
};
