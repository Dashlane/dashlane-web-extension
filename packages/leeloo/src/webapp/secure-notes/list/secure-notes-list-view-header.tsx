import useTranslate from "../../../libs/i18n/useTranslate";
import { Header } from "../../list-view/header";
import { SX_STYLES } from "../styles";
import { useSecureNotesContext } from "../secure-notes-view/secure-notes-context";
const I18N_KEYS = {
  HEADER_NAME: "webapp_secure_notes_list_header_name",
  HEADER_CATEGORY: "webapp_secure_notes_list_header_category",
  HEADER_COLLECTIONS: "webapp_secure_notes_list_header_collections",
  HEADER_CREATED: "webapp_secure_notes_list_header_created",
  HEADER_UPDATED: "webapp_secure_notes_list_header_updated",
};
export const SecureNotesListViewHeader = () => {
  const { translate } = useTranslate();
  const { setSortOrder, sortingOptions, secureNotes } = useSecureNotesContext();
  const renderHeader = () => {
    const secureNote = [
      {
        key: "userModificationDatetime",
        sortable: true,
        content: translate(I18N_KEYS.HEADER_UPDATED),
        sxProps: SX_STYLES.UPDATED_CELL,
        logSubaction: "lastUpdated",
      },
      {
        key: "collections",
        sortable: false,
        content: translate(I18N_KEYS.HEADER_COLLECTIONS),
        sxProps: SX_STYLES.COLLECTIONS_CELL,
        logSubaction: "collections",
      },
    ];
    return [
      {
        key: "title",
        sortable: true,
        content: translate(I18N_KEYS.HEADER_NAME),
        logSubaction: "name",
      },
      ...secureNote,
    ];
  };
  return secureNotes?.length ? (
    <Header
      header={renderHeader()}
      onSort={setSortOrder}
      options={sortingOptions}
    />
  ) : null;
};
