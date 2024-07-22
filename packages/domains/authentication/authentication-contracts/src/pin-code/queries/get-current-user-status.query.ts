import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
export type GetCurrentUserStatusQueryResult =
  | {
      isPinCodeEnabled: true;
      readonly attemptsLeft: number;
    }
  | {
      isPinCodeEnabled: false;
    };
export class GetCurrentUserStatusQuery extends defineQuery<GetCurrentUserStatusQueryResult>(
  {
    scope: UseCaseScope.Device,
  }
) {}
