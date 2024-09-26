import { pipe } from "rxjs";
import { distinctUntilChanged, map } from "rxjs/operators";
import { NoteDetailView, NoteItemView } from "@dashlane/communication";
import { StateOperator } from "Shared/Live";
import {
  getLiveNotesSelector,
  getViewedNotesBatchSelector,
  getViewedNoteSelector,
  notesCountSelector,
} from "DataManagement/SecureNotes/selectors";
import { State } from "Store";
import { parseToken } from "Libs/Query";
import { getLivePersonalInfo } from "DataManagement/PersonalInfo/live";
import { sameBatch } from "Libs/Pagination/same-batch";
export const notesBatch$ = (
  stringToken: string
): StateOperator<NoteItemView[]> => {
  const token = parseToken(stringToken);
  const selector = getViewedNotesBatchSelector(token);
  return pipe(map(selector), distinctUntilChanged(sameBatch));
};
export const getNote$ = (
  id: string
): StateOperator<NoteDetailView | undefined> => {
  const selector = getViewedNoteSelector(id);
  return pipe(map(selector), distinctUntilChanged());
};
export const notesCount$ = (
  stringFilterToken: string
): StateOperator<number> => {
  const filterToken = parseToken(stringFilterToken);
  const selector = (state: State) => notesCountSelector(state, filterToken);
  return pipe(map(selector), distinctUntilChanged());
};
export const notes$ = getLivePersonalInfo(getLiveNotesSelector);
