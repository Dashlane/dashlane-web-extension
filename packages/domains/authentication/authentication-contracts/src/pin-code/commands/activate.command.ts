import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
export interface ActivateCommandRequest {
  pinCode: string;
}
export class ActivateCommand extends defineCommand<ActivateCommandRequest>({
  scope: UseCaseScope.User,
}) {}
