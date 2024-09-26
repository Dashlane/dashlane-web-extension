import { ImportSource } from "@dashlane/communication";
import { fieldProcessorForLastPass } from "./custom-last-pass-logic";
const fieldProcessorForSafari = (
  fieldKey: string,
  fieldValue: string
): string | null => {
  switch (fieldKey) {
    case "title": {
      return null;
    }
    default:
      break;
  }
  return fieldValue;
};
const fieldProcessorForBitwarden = (
  fieldKey: string,
  fieldValue: string
): string | null => {
  switch (fieldKey) {
    case "reprompt":
      if (fieldValue === "0") {
        return null;
      }
      break;
    case "name": {
      if (fieldValue === "--") {
        return null;
      }
      break;
    }
    case "type": {
      return null;
    }
    default:
      break;
  }
  return fieldValue;
};
export type FieldLevelProcessorFunction =
  | ((fieldKey: string, fieldValue: string) => string | null)
  | null;
export const getFieldLevelProcessor = (
  importSource: ImportSource
): FieldLevelProcessorFunction => {
  switch (importSource) {
    case ImportSource.Safari:
      return fieldProcessorForSafari;
    case ImportSource.Bitwarden:
      return fieldProcessorForBitwarden;
    case ImportSource.Lastpass:
      return fieldProcessorForLastPass;
    default:
      return null;
  }
};
