import { ListResults, UserGroupView } from "@dashlane/communication";
import { LiveQuery } from "Shared/Api";
export type UserGroupLiveQueries = {
  liveUserGroups: LiveQuery<string, ListResults<UserGroupView>>;
};
