import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
export class ReturnToDeviceSetupCommand extends defineCommand({
  scope: UseCaseScope.User,
}) {}
