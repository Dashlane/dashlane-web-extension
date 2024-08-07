export type AutofillEngineMessageLogger = (
  message: string,
  details: Record<string, unknown>
) => void;
export type AutofillEngineExceptionLogger = (
  exception: unknown,
  log?: {
    funcName: string;
    fileName: string;
    message?: string;
    omitPrefix?: boolean;
  }
) => void;
