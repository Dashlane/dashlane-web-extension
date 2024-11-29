import { SecureNote } from "@dashlane/vault-contracts";
import { MouseEvent, useCallback, useMemo } from "react";
import { NoteIcon } from "../../../../note-icon";
import useTranslate from "../../../../../libs/i18n/useTranslate";
import { SelectableCollectionListItem } from "./collection-list-item";
import { SelectableItemType } from "../../../../list-view/multi-select/multi-select-context";
export interface SecureNoteItemProps {
  secureNote: SecureNote;
  isShared: boolean;
  isLimitedRight: boolean;
  isSharedCollection: boolean;
  onCheckSecureNote: (
    id: string,
    type: SelectableItemType,
    event: MouseEvent
  ) => void;
}
export const SecureNoteItem = ({
  secureNote,
  isLimitedRight,
  isSharedCollection,
  isShared,
  onCheckSecureNote,
}: SecureNoteItemProps) => {
  const { translate } = useTranslate();
  const { id, title, color, attachments = false } = secureNote;
  const hasAttachments = attachments && attachments.length > 0;
  const isDisabled = hasAttachments || (isSharedCollection && isLimitedRight);
  const toggleSecureNote = useCallback(
    (event: MouseEvent) => {
      onCheckSecureNote(secureNote.id, "notes", event);
    },
    [onCheckSecureNote, secureNote]
  );
  const thumbnail = useMemo(() => <NoteIcon noteType={color} />, [color]);
  return (
    <SelectableCollectionListItem
      type="notes"
      id={id}
      title={title}
      isShared={isShared}
      isDisabled={isDisabled}
      isLimitedRight={isLimitedRight}
      onToggle={toggleSecureNote}
      tooltip={
        hasAttachments
          ? translate("webapp_secure_notes_infobox_has_attachments")
          : isSharedCollection && isLimitedRight
          ? translate("webapp_collection_bulk_disabled_tooltip_limited_right")
          : null
      }
      thumbnail={thumbnail}
    />
  );
};
