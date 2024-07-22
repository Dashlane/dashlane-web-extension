import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
export class DeactivateCommand extends defineCommand({
  scope: UseCaseScope.User,
}) {}
