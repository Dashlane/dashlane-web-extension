import { Query } from "Shared/Api";
export type SettingsQueries = {
  getAnonymousUserId: Query<void, string>;
  getIsUrlBanished: Query<string, boolean>;
  arePasswordsProtected: Query<void, boolean>;
  areRichIconsEnabled: Query<void, boolean>;
};
