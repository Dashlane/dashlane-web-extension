import { CommandQueryBusConfig, NoCommands } from "Shared/Infrastructure";
import { NoteQueries } from "DataManagement/SecureNotes/Api/queries";
import { NoteLiveQueries } from "DataManagement/SecureNotes/Api/live-queries";
import {
  notesPageSelector,
  notesPaginationTokenSelector,
  viewedNoteSelector,
  viewedQueriedNotesSelector,
} from "DataManagement/SecureNotes/selectors";
import { getNote$, notes$ } from "DataManagement/SecureNotes/live";
export const config: CommandQueryBusConfig<
  NoCommands,
  NoteQueries,
  NoteLiveQueries
> = {
  commands: {},
  queries: {
    getNote: { selector: viewedNoteSelector },
    getNotes: { selector: viewedQueriedNotesSelector },
    getNotesPage: { selector: notesPageSelector },
    getNotesPaginationToken: { selector: notesPaginationTokenSelector },
  },
  liveQueries: {
    liveNote: { operator: getNote$ },
    liveNotes: { operator: notes$ },
  },
};
