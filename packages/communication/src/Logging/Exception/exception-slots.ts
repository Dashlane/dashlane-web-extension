import { slot } from "ts-event-bus";
import { LogExceptionParam, LogExceptionResult } from "./types";
export const exceptionCommandsSlots = {
  logException: slot<LogExceptionParam, LogExceptionResult>(),
};
