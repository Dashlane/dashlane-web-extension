import {
  GeneratedPasswordFirstTokenParams,
  GeneratedPasswordItemView,
  GeneratedPasswordsDataQuery,
  ListResults,
  Page,
} from "@dashlane/communication";
import { Query } from "Shared/Api";
export type GeneratedPasswordQueries = {
  getGeneratedPassword: Query<string, GeneratedPasswordItemView | undefined>;
  getGeneratedPasswordsCount: Query<void, number>;
  getGeneratedPasswords: Query<
    GeneratedPasswordsDataQuery,
    ListResults<GeneratedPasswordItemView>
  >;
  getGeneratedPasswordsPage: Query<string, Page<GeneratedPasswordItemView>>;
  getGeneratedPasswordsPaginationToken: Query<
    GeneratedPasswordFirstTokenParams,
    string
  >;
};
