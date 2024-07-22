import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
export interface DeleteSharedCollectionCommandParam {
  id: string;
}
export class DeleteSharedCollectionCommand extends defineCommand<DeleteSharedCollectionCommandParam>(
  { scope: UseCaseScope.User }
) {}
