import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
export class FetchSecureFileQuotaCommand extends defineCommand({
  scope: UseCaseScope.User,
}) {}
