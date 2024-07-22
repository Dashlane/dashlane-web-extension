import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import {
  PendingInvite,
  PendingSharedItemInvite,
} from "../sharing-invites.types";
export interface GetInvitesQueryResult {
  pendingSharedItems: PendingSharedItemInvite[];
  pendingUserGroups: PendingInvite[];
  pendingCollections: PendingInvite[];
}
export class GetInvitesQuery extends defineQuery<GetInvitesQueryResult>({
  scope: UseCaseScope.User,
}) {}
