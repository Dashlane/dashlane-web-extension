import { LiveQuery } from "Shared/Api";
export type SettingsLiveQueries = {
  liveArePasswordsProtected: LiveQuery<void, boolean>;
  liveAreRichIconsEnabled: LiveQuery<void, boolean>;
};
