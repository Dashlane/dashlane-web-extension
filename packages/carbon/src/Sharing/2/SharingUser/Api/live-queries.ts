import {
  ListResults,
  MemberPermission,
  SharingUserView,
} from "@dashlane/communication";
import { LiveQuery } from "Shared/Api";
export type SharingUserLiveQueries = {
  liveSharingUsers: LiveQuery<string, ListResults<SharingUserView>>;
  liveSharingUserPermissionLevel: LiveQuery<
    string,
    MemberPermission | undefined
  >;
};
