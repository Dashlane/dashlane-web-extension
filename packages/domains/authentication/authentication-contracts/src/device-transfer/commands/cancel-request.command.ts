import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
export class CancelRequestCommand extends defineCommand({
  scope: UseCaseScope.User,
}) {}
