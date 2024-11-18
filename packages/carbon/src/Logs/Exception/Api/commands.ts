import { LogExceptionParam, LogExceptionResult } from "@dashlane/communication";
import { Command } from "Shared/Api";
export type ExceptionCommands = {
  logException: Command<LogExceptionParam, LogExceptionResult>;
};
