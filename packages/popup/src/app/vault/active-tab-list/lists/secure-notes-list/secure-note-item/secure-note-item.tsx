import { memo, useCallback } from "react";
import { VaultItemThumbnail } from "@dashlane/design-system";
import { jsx } from "@dashlane/ui-components";
import { SecureNote } from "@dashlane/vault-contracts";
import { VaultItemOrigin } from "../../../../types";
import { SectionRow } from "../../common";
export interface CredentialItemComponentProps {
  note: SecureNote;
  onOpenDetailsView: (note: SecureNote, origin: VaultItemOrigin) => void;
  origin: VaultItemOrigin;
}
const THRESHOLD = 30;
const SecureNoteItemComponent = ({
  note,
  onOpenDetailsView,
  origin,
}: CredentialItemComponentProps) => {
  const openDetailsView = useCallback(
    () => onOpenDetailsView(note, origin),
    [note, onOpenDetailsView, origin]
  );
  const getAbbreviatedContent = (isSecured = false, content = "") => {
    if (isSecured) {
      return "*******";
    }
    if (content.length > THRESHOLD) {
      return content.slice(0, THRESHOLD - 3) + "\u2026";
    }
    return content;
  };
  return (
    <SectionRow
      thumbnail={<VaultItemThumbnail type="secure-note" />}
      itemSpaceId={note.spaceId}
      title={note.title}
      subtitle={getAbbreviatedContent(note.isSecured, note.content)}
      onClick={openDetailsView}
    />
  );
};
export const SecureNoteItem = memo(SecureNoteItemComponent);
