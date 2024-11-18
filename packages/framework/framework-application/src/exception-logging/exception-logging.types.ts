import { ValuesType } from "@dashlane/framework-types";
export const ExceptionCriticalityValues = Object.freeze({
  WARNING: "warning",
  CRITICAL: "critical",
});
export type ExceptionCriticality = ValuesType<
  typeof ExceptionCriticalityValues
>;
export interface ExceptionLogEntry {
  readonly criticality: ExceptionCriticality;
  readonly message: string;
  readonly callStack?: string;
  readonly exceptionType?: string;
  readonly domainName?: string;
  readonly moduleName?: string;
  readonly useCaseName?: string;
  readonly useCaseId?: string;
  readonly useCaseStacktrace?: string[];
  readonly timestamp: number;
  readonly sessionId?: string;
  readonly featuresFlipped?: Array<string>;
  readonly origin?:
    | "exceptionBoundary"
    | "unhandledPromiseRejection"
    | "uncaughtException";
  readonly fileLocation?: string;
  readonly lineNumber?: number;
  readonly cause?: string;
}
export function isExceptionLogEntry(x: unknown): x is ExceptionLogEntry {
  if (!x || typeof x !== "object") {
    return false;
  }
  if (
    !("criticality" in x) ||
    !("timestamp" in x) ||
    !("message" in x) ||
    !("callStack" in x)
  ) {
    return false;
  }
  return (
    (x.criticality === ExceptionCriticalityValues.CRITICAL ||
      x.criticality === ExceptionCriticalityValues.WARNING) &&
    typeof x.message === "string" &&
    typeof x.callStack === "string"
  );
}
export interface ExceptionCaptureContext {
  fileLocation?: string;
  lineNumber?: number;
  domainName?: string;
  moduleName?: string;
  useCaseName?: string;
  useCaseId?: string;
  useCaseStacktrace?: string[];
  featureFlips?: Record<string, boolean | undefined>;
  origin?:
    | "exceptionBoundary"
    | "unhandledPromiseRejection"
    | "uncaughtException";
}
