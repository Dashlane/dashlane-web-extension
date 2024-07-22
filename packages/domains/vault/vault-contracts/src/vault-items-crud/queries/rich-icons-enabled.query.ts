import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
export type RichIconsEnabledResult = boolean;
export class RichIconsEnabledQuery extends defineQuery<RichIconsEnabledResult>({
  scope: UseCaseScope.User,
}) {}
