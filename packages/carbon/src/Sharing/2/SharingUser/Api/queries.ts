import {
  ListResults,
  MemberPermission,
  SharingUserDataQueryRequest,
  SharingUserPermissionLevelRequest,
  SharingUserView,
} from "@dashlane/communication";
import { Query } from "Shared/Api";
export type SharingUserQueries = {
  getSharingUsers: Query<
    SharingUserDataQueryRequest,
    ListResults<SharingUserView>
  >;
  getSharingUserPermissionLevel: Query<
    SharingUserPermissionLevelRequest,
    MemberPermission | undefined
  >;
};
