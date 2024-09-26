import * as Common from "./Common";
export interface NoteCategory extends Common.BaseDataModelObject {
  CategoryName: string;
}
export const NoteTypes = [
  "GRAY",
  "PURPLE",
  "GREEN",
  "BLUE",
  "YELLOW",
  "ORANGE",
  "PINK",
  "BROWN",
  "RED",
] as const;
export type NoteType = (typeof NoteTypes)[number];
export function isNoteCategory(o: any): o is NoteCategory {
  return Boolean(o) && o.kwType === "KWSecureNoteCategory";
}
export interface Note extends Common.DataModelObject {
  Title: string;
  Content: string;
  Category: string;
  Secured: boolean;
  Type: NoteType;
  CreationDate?: number;
  UpdateDate?: number;
  limitedPermissions?: boolean;
}
export function isNote(o: Common.BaseDataModelObject): o is Note {
  return Boolean(o) && o.kwType === "KWSecureNote";
}
