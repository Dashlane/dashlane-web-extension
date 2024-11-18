import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
export interface IsPinCodeCorrectQueryParam {
  pinCode: string;
}
export interface IsPinCodeCorrectQueryResult {
  isPinCodeCorrect: boolean;
}
export class IsPinCodeCorrectQuery extends defineQuery<
  IsPinCodeCorrectQueryResult,
  never,
  IsPinCodeCorrectQueryParam
>({
  scope: UseCaseScope.Device,
}) {}
