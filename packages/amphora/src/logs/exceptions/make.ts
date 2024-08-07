import { ExceptionLog } from "@dashlane/communication";
import {
  ExceptionCode,
  InternalError,
  MakeFileLocationParams,
} from "./error.types";
const { ERROR } = ExceptionCode;
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}
export function isErrorLike(error: unknown): error is Error {
  return typeof error === "object" && error !== null && "message" in error;
}
function isInternalError(error: unknown): error is InternalError {
  return typeof error === "object" && Boolean(error);
}
export function makeFileLocation({
  column,
  line,
  name,
}: MakeFileLocationParams) {
  if (!column && !line && !name) {
    return "";
  }
  return `${name}:${line}:${column}`;
}
export function makeException(error: unknown): ExceptionLog {
  try {
    const isTreatableError = isInternalError(error);
    if (!isTreatableError) {
      return {
        code: ERROR,
        fileName: "make.ts",
        funcName: "makeException",
        legacy: false,
        message: "Potential error is not object",
      };
    }
    const {
      columnNumber,
      fileName,
      funcName,
      level,
      lineNumber,
      message,
      stack,
    } = error;
    const fileLocation = makeFileLocation({
      column: columnNumber,
      line: lineNumber,
      name: fileName,
    });
    return {
      code: level ?? ERROR,
      fileName: fileLocation,
      funcName: funcName ?? "",
      legacy: false,
      line: lineNumber,
      message: message ?? "",
      precisions: stack,
    };
  } catch (ignoredError) {
    return {
      code: ERROR,
      fileName: "make.ts",
      funcName: "makeException",
      legacy: false,
      message: "Caught exception inception",
    };
  }
}
