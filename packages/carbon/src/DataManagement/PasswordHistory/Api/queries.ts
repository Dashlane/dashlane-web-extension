import {
  Page,
  PasswordHistoryFirstTokenParams,
  PasswordHistoryItemView,
} from "@dashlane/communication";
import { Query } from "Shared/Api";
export type PasswordHistoryQueries = {
  getHasPasswordHistory: Query<string, boolean>;
  getPasswordHistoryPage: Query<string, Page<PasswordHistoryItemView>>;
  getPasswordHistoryPaginationToken: Query<
    PasswordHistoryFirstTokenParams,
    string
  >;
};
