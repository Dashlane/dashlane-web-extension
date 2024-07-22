import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
export interface RefuseSharedItemCommandParam {
  vaultItemId: string;
}
export class RefuseSharedItemCommand extends defineCommand<RefuseSharedItemCommandParam>(
  { scope: UseCaseScope.User }
) {}
