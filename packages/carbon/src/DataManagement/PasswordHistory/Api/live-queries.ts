import { PasswordHistoryItemView } from "@dashlane/communication";
import { LiveQuery } from "Shared/Api";
export type PasswordHistoryLiveQueries = {
  livePasswordHistoryBatch: LiveQuery<string, PasswordHistoryItemView[]>;
};
