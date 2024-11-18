import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import { DeleteSessionParams } from "../session.types";
export class DeleteLocalSessionCommand extends defineCommand<DeleteSessionParams>(
  {
    scope: UseCaseScope.Device,
  }
) {}
