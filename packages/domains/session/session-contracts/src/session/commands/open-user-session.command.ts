import {
  CommandSuccess,
  defineCommand,
  UseCaseScope,
} from "@dashlane/framework-contracts";
import { OpenSessionParam } from "../session.types";
import { FunctionalError } from "@dashlane/framework-types";
export enum SessionOpenErrorTypes {
  NotCreated = "notCreated",
  AlreadyOpened = "alreadyOpened",
  MultiAccountNotYetSupported = "multiAccountNotYetSupported",
}
export class SessionNotCreated extends FunctionalError(
  SessionOpenErrorTypes.NotCreated,
  "The session has not been created. Create it first."
) {}
export class SessionAlreadyOpened extends FunctionalError(
  SessionOpenErrorTypes.AlreadyOpened,
  "The session is already opened for this user. Close it first."
) {}
export class MultiAccountNotYetSupported extends FunctionalError(
  SessionOpenErrorTypes.MultiAccountNotYetSupported,
  "Another session is opened. Close it first."
) {}
export type SessionOpenErrors =
  | SessionNotCreated
  | SessionAlreadyOpened
  | MultiAccountNotYetSupported;
export class OpenUserSessionCommand extends defineCommand<
  OpenSessionParam,
  CommandSuccess,
  SessionOpenErrors
>({ scope: UseCaseScope.Device }) {}
