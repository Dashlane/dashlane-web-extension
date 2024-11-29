import { SecureNote } from "@dashlane/vault-contracts";
import useTranslate from "../../../libs/i18n/useTranslate";
import { ItemNotFound, ShareInviteItem } from "../item";
import { InfiniteScrollList } from "../../pagination/infinite-scroll-list";
import {
  useMultiselectContext,
  useMultiselectHandler,
} from "../../list-view/multi-select/multi-select-context";
const I18N_KEYS = {
  NO_NOTES: "webapp_sharing_invite_no_notes_found",
  NO_SELECTED: "webapp_sharing_invite_no_selected_notes_found",
};
export interface Props {
  freeLimitReached: boolean;
  elementsOnlyShowSelected: boolean;
  secureNotes: SecureNote[];
  secureNotesMatchCount: number;
  setPageNumber: (pageNumber: number) => void;
}
export const NotesList = (props: Props) => {
  const {
    freeLimitReached,
    elementsOnlyShowSelected,
    secureNotes,
    secureNotesMatchCount,
    setPageNumber,
  } = props;
  const { translate } = useTranslate();
  const { isSelected } = useMultiselectContext();
  const onSelectItem = useMultiselectHandler(secureNotes);
  if (!secureNotes?.length) {
    const copy = elementsOnlyShowSelected
      ? translate(I18N_KEYS.NO_SELECTED)
      : translate(I18N_KEYS.NO_NOTES);
    return <ItemNotFound text={copy} />;
  }
  const hasMore = secureNotes.length < secureNotesMatchCount;
  return (
    <InfiniteScrollList onNextPage={setPageNumber} hasMore={hasMore}>
      {secureNotes?.map((note: SecureNote) => {
        const checked = isSelected(note.id, "notes");
        if (!note || (elementsOnlyShowSelected && !checked)) {
          return null;
        }
        return (
          <ShareInviteItem
            checked={checked}
            freeLimitReached={freeLimitReached}
            hasAttachments={note.attachments && note.attachments.length > 0}
            id={note.id}
            key={note.id}
            title={note.title}
            type={"notes"}
            logoColor={note.color}
            onSelectItem={onSelectItem}
          />
        );
      })}
    </InfiniteScrollList>
  );
};
