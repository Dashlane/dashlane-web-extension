import {
  ImportSource,
  SupportedVaultItems,
  SupportedVaultTypes,
} from "@dashlane/communication";
import { itemTypeProcessorForLastPass } from "./custom-last-pass-logic";
type ItemTypeProcessorFunction =
  | ((
      csvRowObject: Partial<SupportedVaultItems[keyof SupportedVaultItems]>
    ) => SupportedVaultTypes | null)
  | null;
export const getItemTypeProcessor = (
  importSource: ImportSource
): ItemTypeProcessorFunction => {
  switch (importSource) {
    case ImportSource.Lastpass:
      return itemTypeProcessorForLastPass;
    default:
      return null;
  }
};
