import {
  GeneratedPasswordItemView,
  ListResults,
} from "@dashlane/communication";
import { LiveQuery } from "Shared/Api";
export type GeneratedPasswordsLiveQueries = {
  liveGeneratedPasswordsCount: LiveQuery<void, number>;
  liveGeneratedPasswords: LiveQuery<
    string,
    ListResults<GeneratedPasswordItemView>
  >;
};
