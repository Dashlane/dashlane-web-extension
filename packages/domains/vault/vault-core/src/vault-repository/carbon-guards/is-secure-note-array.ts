import { Note } from "@dashlane/communication";
import { VaultItemType } from "@dashlane/vault-contracts";
import { isVaultItemArray } from "./is-vault-item-array";
export const isSecureNoteArray = (uut: unknown): uut is Note[] =>
  isVaultItemArray(uut, VaultItemType.SecureNote);
