import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
export interface UpdateSharedItemContentRequest {
  itemContent: string;
  itemId: string;
}
export class UpdateSharedItemContentCommand extends defineCommand<UpdateSharedItemContentRequest>(
  {
    scope: UseCaseScope.User,
  }
) {}
