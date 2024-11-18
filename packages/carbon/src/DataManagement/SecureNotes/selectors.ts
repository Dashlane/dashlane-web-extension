import { identity } from "ramda";
import { createSelector } from "reselect";
import {
  DataQuery,
  ListResults,
  Note,
  NoteDetailView,
  NoteFilterField,
  NoteFilterToken,
  NoteItemView,
  NotesFirstTokenParams,
  NoteSortField,
  Page,
} from "@dashlane/communication";
import { State } from "Store";
import {
  getNotesBatch,
  getNotesFilterToken,
  getNotesFirstToken,
  getNotesSortToken,
  viewNotesBatch,
} from "DataManagement/SecureNotes/pagination";
import { getNoteMappers } from "DataManagement/SecureNotes/mappers";
import { viewNote } from "DataManagement/SecureNotes/utils";
import { NoteMappers } from "DataManagement/SecureNotes/types";
import {
  generateNextToken,
  generatePrevToken,
  getBatch,
} from "Libs/Pagination";
import {
  createOptimizedFilterTokenSelector,
  createOptimizedSortTokenSelector,
  filterData,
  optimizeBatchSelector,
  parseToken,
  queryData,
  stringifyToken,
} from "Libs/Query";
import { Token } from "Libs/Pagination/types";
import { limitedSharingItemsSelector } from "Sharing/2/Services/selectors/limited-sharing-items.selector";
import { findDataModelObject } from "DataManagement/PersonalData/utils";
import { noteMatch, NoteMatch } from "DataManagement/SecureNotes/search";
import { getQuerySelector } from "DataManagement/query-selector";
import { viewListResults } from "DataManagement/Search/views";
import { makeLiveSelectorGetter } from "DataManagement/live-selector-getter";
import { notesSelector } from "DataManagement/SecureNotes/selectors/notes.selector";
const countNotes = (
  mappers: NoteMappers,
  noteMatch: NoteMatch,
  filterToken: NoteFilterToken,
  notes: Note[]
): number => {
  const matching = filterData(mappers, noteMatch, filterToken, notes);
  return matching.length;
};
export const noteSelector = (state: State, noteId: string): Note => {
  const notes = notesSelector(state);
  return findDataModelObject(noteId, notes);
};
export const viewedNoteSelector = (
  state: State,
  noteId: string
): NoteDetailView | undefined => {
  const note = noteSelector(state, noteId);
  if (!note) {
    return undefined;
  }
  return viewNote(note);
};
export const notesPageSelector = (
  state: State,
  tokenString: string
): Page<NoteItemView> => {
  const token = parseToken(tokenString);
  const { sortToken, filterToken } = token;
  const tokens = { sortToken, filterToken };
  const mappers = fieldMappersSelector(state);
  const notes = notesQuerySelector(state, tokens);
  const nextToken = generateNextToken(mappers, token, notes);
  const prevToken = generatePrevToken(mappers, token, notes);
  const batch = getBatch(mappers, token, notes);
  const nextTokenString = stringifyToken(nextToken);
  const prevTokenString = stringifyToken(prevToken);
  const viewedBatch = viewNotesBatch(batch);
  return {
    batch: viewedBatch,
    nextToken: nextTokenString,
    prevToken: prevTokenString,
  };
};
export const notesPaginationTokenSelector = (
  state: State,
  params: NotesFirstTokenParams
): string => {
  const sortToken = getNotesSortToken(params);
  const filterToken = getNotesFilterToken(params);
  const mappers = fieldMappersSelector(state);
  const tokens = { sortToken, filterToken };
  const notes = notesQuerySelector(state, tokens);
  const token = getNotesFirstToken(mappers, tokens, params, notes);
  const stringified = stringifyToken(token);
  return stringified;
};
export const fieldMappersSelector = createSelector(
  limitedSharingItemsSelector,
  getNoteMappers
);
const sortTokenSelector = createOptimizedSortTokenSelector(
  (_state: any, { sortToken }: DataQuery<NoteSortField, NoteFilterField>) =>
    sortToken,
  identity
);
const filterTokenSelector = createOptimizedFilterTokenSelector(
  (_state: any, { filterToken }: DataQuery<NoteSortField, NoteFilterField>) =>
    filterToken,
  identity
);
const noteMatchSelector = () => noteMatch;
export const notesQuerySelector = createSelector(
  fieldMappersSelector,
  noteMatchSelector,
  sortTokenSelector,
  filterTokenSelector,
  notesSelector,
  queryData
);
export const getViewedNotesBatchSelector = (
  token: Token<NoteSortField, NoteFilterField>
) => {
  const { sortToken, filterToken } = token;
  const tokens = { sortToken, filterToken };
  const getBatch = getNotesBatch(token);
  const batchSelector = createSelector(
    (state) => notesQuerySelector(state, tokens),
    fieldMappersSelector,
    getBatch
  );
  const optimizedBatchSelector = optimizeBatchSelector(batchSelector);
  return createSelector(optimizedBatchSelector, viewNotesBatch);
};
export const getLiveNotesSelector = makeLiveSelectorGetter(
  notesSelector,
  () => viewNotesBatch,
  noteMatchSelector,
  fieldMappersSelector
);
export const getViewedNoteSelector = (noteId: string) => {
  const noteSelector = createSelector(notesSelector, (notes) =>
    findDataModelObject(noteId, notes)
  );
  return createSelector(noteSelector, viewNote);
};
export const queryNotesSelector = getQuerySelector(
  notesSelector,
  noteMatchSelector,
  fieldMappersSelector
);
export const viewedQueriedNotesSelector = (
  state: State,
  query: DataQuery<NoteSortField, NoteFilterField>
): ListResults<NoteItemView> => {
  const queryResults = queryNotesSelector(state, query);
  return viewListResults(viewNotesBatch)(queryResults);
};
export const notesCountSelector = createSelector(
  fieldMappersSelector,
  noteMatchSelector,
  filterTokenSelector,
  notesSelector,
  countNotes
);
