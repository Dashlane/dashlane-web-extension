import { NoteColors } from "@dashlane/vault-contracts";
export interface SecureNoteView {
  id: string;
  color: NoteColors;
  title: string;
  hasAttachments: boolean;
  isSecured: boolean;
}
