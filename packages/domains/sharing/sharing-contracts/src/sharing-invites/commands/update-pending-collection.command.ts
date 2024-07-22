import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import { SharedCollection } from "../../sharing-collections/sharing-collections.types";
export class UpdatePendingCollectionsCommand extends defineCommand<
  SharedCollection[]
>({
  scope: UseCaseScope.User,
}) {}
