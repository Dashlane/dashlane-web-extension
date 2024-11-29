import {
  EmbeddedAttachment,
  SaveSecretFromUIContent,
  SaveNoteFromUIContent as SaveSecureNoteFromUIContent,
} from "@dashlane/communication";
export type SaveSecureNoteContentValues = SaveSecureNoteFromUIContent & {
  attachments: EmbeddedAttachment[];
  id: string;
  limitedPermissions?: boolean;
  spaceId: string | null;
};
export type SaveSecretContentValues = SaveSecretFromUIContent & {
  attachments: EmbeddedAttachment[];
  id: string;
  limitedPermissions?: boolean;
  spaceId: string | null;
};
