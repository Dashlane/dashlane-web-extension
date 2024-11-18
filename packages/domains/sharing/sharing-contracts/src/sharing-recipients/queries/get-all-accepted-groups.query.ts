import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { SharingGroup } from "../sharing-recipients.types";
export type GetAllAcceptedGroupsResult = SharingGroup[];
export class GetAllAcceptedGroupsQuery extends defineQuery<GetAllAcceptedGroupsResult>(
  {
    scope: UseCaseScope.User,
  }
) {}
