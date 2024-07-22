import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
export class RefreshRequestCommand extends defineCommand({
  scope: UseCaseScope.User,
}) {}
