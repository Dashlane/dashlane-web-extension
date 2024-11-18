import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
export class PrepareLocalDataFlushCommand extends defineCommand({
  scope: UseCaseScope.User,
}) {}
