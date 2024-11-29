import { SecureNote } from "@dashlane/vault-contracts";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { SecureNoteItem } from "./secure-note-item";
import { CollectionDialogList, Permissions } from "./collection-dialog-list";
import { useCallback } from "react";
import { useMultiselectHandler } from "../../../../list-view/multi-select/multi-select-context";
interface Props {
  secureNotes: SecureNote[];
  matchCount: number;
  isSharedCollection: boolean;
  setPageNumber: (pageNumber: number) => void;
}
export const SecureNotesCollectionDialogList = (props: Props) => {
  const { secureNotes, matchCount, setPageNumber, isSharedCollection } = props;
  const onCheckSecureNote = useMultiselectHandler(secureNotes);
  const { translate } = useTranslate();
  const handleRenderItem = useCallback(
    (
      secureNote: SecureNote,
      index: number,
      { isShared, isLimitedRight }: Permissions
    ) => (
      <SecureNoteItem
        key={secureNote.id}
        secureNote={secureNote}
        isShared={isShared}
        isLimitedRight={isLimitedRight}
        isSharedCollection={isSharedCollection}
        onCheckSecureNote={onCheckSecureNote}
      />
    ),
    [isSharedCollection, onCheckSecureNote]
  );
  return (
    <CollectionDialogList
      items={secureNotes}
      matchCount={matchCount}
      notFoundText={translate("webapp_sharing_invite_no_notes_found")}
      setPageNumber={setPageNumber}
      renderItem={handleRenderItem}
    />
  );
};
