import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
export class MoveCollectionItemsToBusinessSpaceCommand extends defineCommand({
  scope: UseCaseScope.User,
}) {}
