import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import { CloseSessionParams } from "../session.types";
export class CloseUserSessionCommand extends defineCommand<CloseSessionParams>({
  scope: UseCaseScope.Device,
}) {}
