import { Note as CarbonSecureNote } from "@dashlane/communication";
import { NoteColors, SecureNote } from "@dashlane/vault-contracts";
import { mapKeysToLowercase } from "../utility";
export const secureNoteMapper = (
  carbonSecureNote: CarbonSecureNote
): SecureNote => {
  const { Secured, Type, Category, LocaleFormat, ...rest } = carbonSecureNote;
  return {
    ...mapKeysToLowercase(rest),
    isSecured: Secured,
    color: NoteColors[Type] || NoteColors.GRAY,
  };
};
