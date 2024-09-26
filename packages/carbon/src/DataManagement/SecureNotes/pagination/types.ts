import { Note } from "@dashlane/communication";
export type ComputedMapperField =
  | "computed_isAdmin"
  | "computed_hasAttachments";
type NoteMapper = (note: Note) => any;
export type NoteMappers = {
  [key in ComputedMapperField]: NoteMapper;
} & Partial<{
  [key in keyof Note]: NoteMapper;
}>;
