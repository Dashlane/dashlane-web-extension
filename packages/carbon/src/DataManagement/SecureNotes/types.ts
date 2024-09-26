import {
  Mappers,
  Note,
  NoteFilterField,
  NoteSortField,
} from "@dashlane/communication";
export type NoteMappers = Mappers<Note, NoteSortField, NoteFilterField>;
