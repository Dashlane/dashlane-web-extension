import * as Common from "./Common";
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
export interface Note extends Common.DataModelObject {
  Title: string;
  Content: string;
  Category?: string;
  Secured: boolean;
  Type: NoteType;
  CreationDate?: number;
  UpdateDate?: number;
  limitedPermissions?: boolean;
}
export function isNote(o: Common.BaseDataModelObject): o is Note {
  return Boolean(o) && o.kwType === "KWSecureNote";
}
