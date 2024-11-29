import { ReactNode } from "react";
import { fromUnixTime } from "date-fns";
import { PageView } from "@dashlane/hermes";
import { SecureNote, VaultItemType } from "@dashlane/vault-contracts";
import IntelligentTooltipOnOverflow from "../../../libs/dashlane-style/intelligent-tooltip-on-overflow";
import LocalizedTimeAgo from "../../../libs/i18n/localizedTimeAgo";
import { logPageView } from "../../../libs/logs/logEvent";
import { logSelectSecureNote } from "../../../libs/logs/events/vault/select-item";
import {
  useLocation,
  useRouterGlobalSettingsContext,
} from "../../../libs/router";
import Row from "../../list-view/row";
import { NoteTitle } from "./note-title";
import { SecureNotesQuickActions } from "./secure-notes-quick-actions";
import { VaultRowItemCollectionsList } from "../../credentials/list/collections";
import { SX_STYLES } from "../styles";
import { useSecureNotesContext } from "../secure-notes-view/secure-notes-context";
const displayUpdatedAt = (userModificationDatetime?: number): ReactNode => {
  return userModificationDatetime ? (
    <IntelligentTooltipOnOverflow>
      <LocalizedTimeAgo date={fromUnixTime(userModificationDatetime)} />
    </IntelligentTooltipOnOverflow>
  ) : null;
};
interface NoteProps {
  note: SecureNote;
}
export const NoteRow = ({ note }: NoteProps) => {
  const { routes } = useRouterGlobalSettingsContext();
  const { pathname } = useLocation();
  const { previousPage } = useSecureNotesContext();
  const secureNoteItemRoute = routes.userVaultItem(
    note.id,
    VaultItemType.SecureNote,
    pathname
  );
  const onRowClick = () => {
    logPageView(PageView.ItemSecureNoteDetails);
    logSelectSecureNote(note.id);
  };
  const renderRowData = () => {
    const secureNote = [
      {
        key: "updatedAt",
        content: displayUpdatedAt(note.userModificationDatetime),
        sxProps: SX_STYLES.UPDATED_CELL,
      },
      {
        key: "collection",
        content: <VaultRowItemCollectionsList vaultItemId={note.id} />,
        sxProps: SX_STYLES.COLLECTIONS_CELL,
      },
    ];
    return [
      {
        key: "title",
        content: <NoteTitle note={note} />,
      },
      ...secureNote,
    ];
  };
  return (
    <Row
      previousPage={previousPage}
      key={note.id}
      type={"link"}
      link={secureNoteItemRoute}
      onClick={onRowClick}
      data={renderRowData()}
      actions={
        <SecureNotesQuickActions
          note={note}
          secureNoteItemRoute={secureNoteItemRoute}
        />
      }
    />
  );
};
