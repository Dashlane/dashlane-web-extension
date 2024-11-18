import { ExceptionCriticality, PlatformString } from "@dashlane/communication";
export interface InternalExceptionLog {
  error: Error;
  code?: ExceptionCriticality;
}
export interface ExceptionLogRequest {
  action: string;
  type: PlatformString;
  version: string;
  code: ExceptionCriticality;
  osVersion?: string;
  browser?: string;
  browserVersion?: string;
  os?: string;
  message?: string;
  stack?: string;
  exceptiontype?: string;
  functionName?: string;
  line?: number;
  file?: string;
  legacy?: boolean;
  sessionId?: string;
  additionalInfo?: string;
}
