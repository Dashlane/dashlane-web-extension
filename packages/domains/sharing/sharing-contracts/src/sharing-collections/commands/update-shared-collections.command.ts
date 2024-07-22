import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import { SharedCollection } from "../sharing-collections.types";
export interface UpdateSharedCollectionsCommandParam {
  collections: SharedCollection[];
}
export class UpdateSharedCollectionsCommand extends defineCommand<UpdateSharedCollectionsCommandParam>(
  { scope: UseCaseScope.User }
) {}
