import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
export class RejectDeviceTransferRequestCommand extends defineCommand({
  scope: UseCaseScope.User,
}) {}
