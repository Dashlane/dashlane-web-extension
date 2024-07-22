import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
export interface GetStatusQueryParam {
  readonly loginEmail: string;
}
export type GetStatusQueryResult =
  | {
      isPinCodeEnabled: true;
      readonly attemptsLeft: number;
    }
  | {
      isPinCodeEnabled: false;
    };
export class GetStatusQuery extends defineQuery<
  GetStatusQueryResult,
  never,
  GetStatusQueryParam
>({
  scope: UseCaseScope.Device,
}) {}
