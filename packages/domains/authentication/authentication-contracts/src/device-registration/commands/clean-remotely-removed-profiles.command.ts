import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
export class CleanRemotelyRemovedProfilesCommand extends defineCommand({
  scope: UseCaseScope.Device,
}) {}
