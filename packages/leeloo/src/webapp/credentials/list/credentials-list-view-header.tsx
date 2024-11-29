import React from "react";
import useTranslate from "../../../libs/i18n/useTranslate";
import { Header } from "../../list-view/header";
import { useCredentialsContext } from "../credentials-view/credentials-context";
import { SX_STYLES } from "../style";
const I18N_KEYS = {
  ROW_NAME: "webapp_credentials_header_row_name",
  ROW_COLLECTION: "webapp_credentials_header_row_category",
  ROW_LAST_USED: "webapp_credentials_header_row_last_used",
};
export const CredentialsListViewHeader = () => {
  const { translate } = useTranslate();
  const { setSortOrder, sortingOptions } = useCredentialsContext();
  return (
    <Header
      header={[
        {
          key: "title",
          sortable: true,
          content: translate(I18N_KEYS.ROW_NAME),
          logSubaction: "name",
        },
        {
          key: "lastUse",
          sortable: true,
          content: translate(I18N_KEYS.ROW_LAST_USED),
          sxProps: SX_STYLES.LAST_USE_CELL,
          logSubaction: "lastUsed",
        },
        {
          key: "collection",
          sortable: false,
          content: translate(I18N_KEYS.ROW_COLLECTION),
          sxProps: SX_STYLES.COLLECTION_CELL,
        },
      ]}
      onSort={setSortOrder}
      options={sortingOptions}
      sxProps={{
        paddingLeft: "42px",
      }}
    />
  );
};
