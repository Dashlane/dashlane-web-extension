import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
export interface RenameCollectionCommandParam {
  collectionId: string;
  newName: string;
}
export class RenameCollectionCommand extends defineCommand<RenameCollectionCommandParam>(
  { scope: UseCaseScope.User }
) {}
