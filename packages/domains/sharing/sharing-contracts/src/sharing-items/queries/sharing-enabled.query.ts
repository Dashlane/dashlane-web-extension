import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
export type SharingEnabledResult = boolean;
export class SharingEnabledQuery extends defineQuery<SharingEnabledResult>({
  scope: UseCaseScope.User,
}) {}
