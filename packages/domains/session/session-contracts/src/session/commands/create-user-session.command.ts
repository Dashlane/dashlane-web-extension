import {
  CommandSuccess,
  defineCommand,
  UseCaseScope,
} from "@dashlane/framework-contracts";
import { SessionCreationParams } from "../session.types";
import { FunctionalError } from "@dashlane/framework-types";
export enum SessionCreationErrorTypes {
  AlreadyExists = "alreadyExists",
}
export class SessionAlreadyExists extends FunctionalError(
  SessionCreationErrorTypes.AlreadyExists,
  "The session already exists. Delete it first."
) {}
export type CreateSessionErrors = SessionAlreadyExists;
export class CreateUserSessionCommand extends defineCommand<
  SessionCreationParams,
  CommandSuccess,
  CreateSessionErrors
>({
  scope: UseCaseScope.Device,
}) {}
