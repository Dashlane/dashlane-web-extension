import {
  ListResults,
  NoteDetailView,
  NoteItemView,
} from "@dashlane/communication";
import { LiveQuery } from "Shared/Api";
export type NoteLiveQueries = {
  liveNote: LiveQuery<string, NoteDetailView | undefined>;
  liveNotes: LiveQuery<string, ListResults<NoteItemView>>;
};
