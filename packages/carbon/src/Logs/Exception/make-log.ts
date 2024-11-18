import { v4 as uuidv4 } from "uuid";
import {
  AdditionalInfo,
  ExceptionCriticality,
  ExceptionLog,
  ExceptionType,
  PlatformInfo,
  PlatformString,
} from "@dashlane/communication";
import { getPlatformInfo } from "Application/platform-info";
import {
  ExceptionLogRequest,
  InternalExceptionLog,
} from "Logs/Exception/types";
import { isCarbonError } from "Libs/Error";
import { config } from "config-service";
interface PlatformParams {
  type: PlatformString;
  version: string;
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
}
function makePlatformParams(platformInfo: PlatformInfo): PlatformParams {
  return {
    type: platformInfo.platformName,
    version: platformInfo.appVersion,
    osVersion: platformInfo.osVersion,
    browser: platformInfo.browser,
    browserVersion: platformInfo.browserVersion,
    os: platformInfo.os,
  };
}
interface ExceptionParams {
  action: string;
  code: ExceptionCriticality;
  message: string;
  exceptiontype: string;
  functionName: string;
  file: string;
  legacy: boolean;
  line: number;
  stack: string;
  sessionId: string;
  additionalInfo: string;
  initialUseCaseModule?: string;
  initialUseCaseName?: string;
  useCaseStacktrace?: string[];
  featureFlips?: string[];
  errorCount: number;
}
export const anonymousSessionId = uuidv4();
function makeAdditionalInfo(logAdditionalInfo: AdditionalInfo): string {
  const codeName = config.CODE_NAME;
  const manifestVersion = config.MANIFEST_VERSION;
  const additionalInfo = { ...logAdditionalInfo, codeName, manifestVersion };
  return JSON.stringify(additionalInfo);
}
function makeExceptionParamsFromArguments(log: ExceptionLog): ExceptionParams {
  const additionalInfo = makeAdditionalInfo(log.additionalInfo);
  return {
    action: "logOnline",
    code:
      log.code === ExceptionCriticality.WARNING
        ? ExceptionCriticality.WARNING
        : ExceptionCriticality.ERROR,
    message: log.message || "",
    exceptiontype: log.type,
    functionName: log.funcName,
    file: log.fileName,
    legacy: Boolean(log.legacy),
    line: log.line,
    stack: log.precisions,
    sessionId: anonymousSessionId,
    additionalInfo,
    errorCount: 1,
    featureFlips: [],
    initialUseCaseModule: log.initialUseCaseModule ?? "carbon",
    initialUseCaseName: log.initialUseCaseName,
    useCaseStacktrace: log.useCaseStacktrace ?? [],
  };
}
function makeExceptionParams(
  exceptionType: string,
  log: ExceptionLog | InternalExceptionLog
): ExceptionParams {
  const internalLog = log as InternalExceptionLog;
  if (internalLog.error) {
    const message =
      internalLog.error["precisions"] &&
      typeof internalLog.error["precisions"] === "string"
        ? `${internalLog.error.message}\n${internalLog.error["precisions"]}`
        : internalLog.error.message;
    const additionalInfo = isCarbonError(internalLog.error)
      ? internalLog.error.getAdditionalInfo()
      : {};
    return makeExceptionParamsFromArguments({
      type: exceptionType,
      message,
      code: internalLog.code || internalLog.error["errorLevel"],
      precisions: internalLog.error.stack,
      additionalInfo,
      initialUseCaseModule: "carbon",
      initialUseCaseName: "",
    });
  }
  return makeExceptionParamsFromArguments(
    Object.assign({ type: exceptionType }, log) as ExceptionLog
  );
}
export default function (
  exceptionType: ExceptionType,
  log: ExceptionLog | InternalExceptionLog
): ExceptionLogRequest {
  return {
    ...makePlatformParams(getPlatformInfo()),
    ...makeExceptionParams(exceptionType, log),
  };
}
