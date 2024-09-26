import { curry } from "ramda";
import {
  DataQuery,
  Note,
  NoteCategory,
  NoteFilterField,
  NoteFilterToken,
  NoteItemView,
  NotesFirstTokenParams,
  NoteSortField,
  NoteSortToken,
} from "@dashlane/communication";
import { generateFirstToken, getBatch } from "Libs/Pagination";
import { Token } from "Libs/Pagination/types";
import { NoteMappers } from "DataManagement/SecureNotes/types";
import { listView } from "DataManagement/SecureNotes/views/list";
import { getCategory } from "DataManagement/SecureNotes/helpers";
export const getNotesFilterToken = ({
  filterCriteria,
}: NotesFirstTokenParams): NoteFilterToken => ({
  filterCriteria: filterCriteria || [],
});
export const getNotesSortToken = ({
  sortCriteria,
}: NotesFirstTokenParams): NoteSortToken => ({
  uniqField: "id",
  sortCriteria: sortCriteria || [],
});
export const getNotesFirstToken = (
  mappers: NoteMappers,
  tokens: DataQuery<NoteSortField, NoteFilterField>,
  params: NotesFirstTokenParams,
  sortedNotes: Note[]
): Token<NoteSortField, NoteFilterField> =>
  generateFirstToken(
    mappers,
    tokens,
    params.initialBatchSize || 30,
    sortedNotes
  );
export const viewNotesBatch = (
  batch: Note[],
  categories: NoteCategory[]
): NoteItemView[] => {
  const getCategoryById = getCategory(categories);
  const view = listView(getCategoryById, batch);
  return view;
};
export const getNotesBatch = curry(
  (
    token: Token<NoteSortField, NoteFilterField>,
    notes: Note[],
    mappers: NoteMappers
  ): Note[] => getBatch(mappers, token, notes)
);
