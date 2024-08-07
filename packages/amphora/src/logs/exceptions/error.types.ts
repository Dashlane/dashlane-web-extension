import { ExceptionLog } from "@dashlane/communication";
export enum ExceptionCode {
  UNKNOWN = 0,
  WARNING = 1,
  ERROR = 2,
}
export interface MakeFileLocationParams {
  column?: number;
  line?: number;
  name?: string;
}
export interface InternalError extends Partial<Error> {
  columnNumber?: number;
  fileName?: string;
  funcName?: string;
  level?: ExceptionCode;
  lineNumber?: number;
}
export type SendExceptionLog = (log: ExceptionLog) => void;
