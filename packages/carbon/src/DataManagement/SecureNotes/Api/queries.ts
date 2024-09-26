import {
  ListResults,
  NoteCategoryDetailView,
  NoteDataQuery,
  NoteDetailView,
  NoteItemView,
  NotesFirstTokenParams,
  Page,
} from "@dashlane/communication";
import { Query } from "Shared/Api";
export type NoteQueries = {
  getNote: Query<string, NoteDetailView>;
  getNoteCategories: Query<void, ListResults<NoteCategoryDetailView>>;
  getNotes: Query<NoteDataQuery, ListResults<NoteItemView>>;
  getNotesPage: Query<string, Page<NoteItemView>>;
  getNotesPaginationToken: Query<NotesFirstTokenParams, string>;
};
