import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
export class ApproveDeviceTransferRequestCommand extends defineCommand({
  scope: UseCaseScope.User,
}) {}
