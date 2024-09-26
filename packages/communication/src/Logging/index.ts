import { Enum } from "typescript-string-enums";
export const LoggingEventType = Enum("EXCEPTION_LOG");
export type LoggingEventType = Enum<typeof LoggingEventType>;
export interface LoggingEvent {}
export interface AdditionalInfo {
  codeName?: CodeName;
}
export type CodeName = "amphora" | "extension-legacy" | "hosted-webapp";
export interface ExceptionLog extends LoggingEvent {
  message: string;
  code?: number;
  funcName?: string;
  fileName?: string;
  precisions?: string;
  line?: number;
  type?: string;
  legacy?: boolean;
  additionalInfo?: AdditionalInfo;
  initialUseCaseModule?: string;
  initialUseCaseName?: string;
  useCaseStacktrace?: string[];
  featureFlips?: string[];
}
export interface AnonymousLogsMetadata {
  anonymouscomputerid: string;
}
export interface FeatureFlippingUsageLog {
  type: string;
  status: "true" | "false";
}
export {
  ApplicationBuildType,
  type PlatformInfo,
  type PlatformString,
} from "@dashlane/framework-contracts";
