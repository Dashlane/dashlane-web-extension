import { SecureNoteCategory } from "@dashlane/vault-contracts";
export const isSecureNoteCategory = (
  uut: unknown
): uut is SecureNoteCategory[] => {
  if (!Array.isArray(uut)) {
    return false;
  }
  if (uut.length === 0) {
    return true;
  }
  const item = uut[0] as Partial<SecureNoteCategory>;
  return item.kwType === "KWSecureNoteCategory";
};
