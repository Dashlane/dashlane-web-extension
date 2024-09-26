import { DataModelType, Note } from "@dashlane/communication";
import { PersonalDataVaultItems } from "DataManagement/types";
import { handleSpecialCharacter } from "./handle-special-character";
import {
  formatDataToCSV,
  formatHeader,
  getCollectionsByItemId,
  getItemCollections,
} from "./helpers";
export function getSecureNotesExport(
  personalData: PersonalDataVaultItems
): string {
  const secureNoteData = personalData.notes;
  const collections = personalData.collections;
  const collectionsBySecureNoteId = getCollectionsByItemId(
    collections,
    DataModelType.KWSecureNote
  );
  const metaData = [
    { headerKey: "title", dataKey: "Title" },
    { headerKey: "note", dataKey: "Content" },
    { headerKey: "category", dataKey: "Category" },
  ];
  const formatSecureNotes = (secureNoteData: Note[]): string => {
    return secureNoteData
      .map((note) => {
        return metaData
          .map((secureNote) => {
            const filteredValue = note[secureNote.dataKey] ?? "";
            if (secureNote.dataKey === "Content" && filteredValue !== "") {
              return handleSpecialCharacter(filteredValue);
            } else if (secureNote.dataKey === "Category") {
              return handleSpecialCharacter(
                getItemCollections(collectionsBySecureNoteId, note.Id)
              );
            } else {
              const value = `${filteredValue}`;
              return handleSpecialCharacter(value);
            }
          })
          .join(",");
      })
      .join("\r\n");
  };
  return formatDataToCSV([
    formatHeader(metaData),
    formatSecureNotes(secureNoteData),
  ]);
}
