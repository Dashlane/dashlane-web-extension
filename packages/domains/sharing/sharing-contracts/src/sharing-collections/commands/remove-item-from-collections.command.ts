import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
export interface RemoveItemFromCollectionsCommandParam {
  collectionIds: string[];
  itemId: string;
}
export class RemoveItemFromCollectionsCommand extends defineCommand<RemoveItemFromCollectionsCommandParam>(
  { scope: UseCaseScope.User }
) {}
