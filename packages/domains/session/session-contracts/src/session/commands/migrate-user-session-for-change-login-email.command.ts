import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import { AnyFunctionalError } from "@dashlane/framework-types";
import { CopyUserDataAndOpenSessionParams } from "../session.types";
export class CopyUserDataAndOpenSessionCommand extends defineCommand<
  CopyUserDataAndOpenSessionParams,
  undefined,
  AnyFunctionalError
>({
  scope: UseCaseScope.Device,
}) {}
