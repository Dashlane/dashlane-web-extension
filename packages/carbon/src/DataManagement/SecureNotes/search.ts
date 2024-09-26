import { Match, Note } from "@dashlane/communication";
import { match } from "DataManagement/Search/match";
import { stringProp } from "DataManagement/Search/utils";
type Getters = ((n: Note) => string)[];
export const limitedSearchGetters: Getters = [stringProp<Note>("Title")];
export const searchGetters: Getters = [
  ...limitedSearchGetters,
  stringProp<Note>("Content"),
];
export type NoteMatch = Match<Note>;
export const noteMatch = (query: string, note: Note) => {
  const fields = note.Secured ? limitedSearchGetters : searchGetters;
  return match(fields)(query, note);
};
