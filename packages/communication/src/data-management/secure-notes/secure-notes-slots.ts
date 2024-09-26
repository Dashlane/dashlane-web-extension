import { slot } from "ts-event-bus";
import { ListResults, liveSlot, Page } from "../../CarbonApi";
import {
  NoteCategoryDetailView,
  NoteDataQuery,
  NoteDetailView,
  NoteItemView,
  NotesFirstTokenParams,
} from "./types";
export const noteQueriesSlots = {
  getNote: slot<string, NoteDetailView>(),
  getNoteCategories: slot<void, ListResults<NoteCategoryDetailView>>(),
  getNotes: slot<NoteDataQuery, ListResults<NoteItemView>>(),
  getNotesPage: slot<string, Page<NoteItemView>>(),
  getNotesPaginationToken: slot<NotesFirstTokenParams, string>(),
};
export const noteLiveQueriesSlots = {
  liveNote: liveSlot<NoteDetailView | undefined>(),
  liveNotes: liveSlot<ListResults<NoteItemView>>(),
};
