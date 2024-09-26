import { ExceptionLog } from "..";
export enum ExceptionCriticality {
  UNKNOWN = 0,
  WARNING = 1,
  ERROR = 2,
}
export type ExceptionType =
  | "carbonException"
  | "maverickException"
  | "autofillEngineException"
  | "leelooException"
  | "extensionException"
  | "injectedtsException"
  | "webcardsException"
  | "tiresiasException"
  | "popupException";
export interface LogExceptionParam {
  exceptionType: ExceptionType;
  log: ExceptionLog;
}
export type LogExceptionResult = LogExceptionSuccess | LogExceptionError;
export interface LogExceptionSuccess {
  success: true;
}
export interface LogExceptionError {
  success: false;
}
