import {
  BreachContent,
  VersionedBreachContent,
} from "DataManagement/Breaches/types";
export interface IncomingBreach {
  content: BreachContent;
  leakedPasswords: string[];
}
export interface S3FileBreachContent {
  breaches: VersionedBreachContent[];
  revision: number;
}
export interface IncomingDataLeakPasswordInfo {
  type: "password";
  hashMethod: "plaintext";
  value: string;
}
export interface IncomingDataLeakBreachDetails {
  breachId: string;
  data: Array<IncomingDataLeakPasswordInfo>;
}
export type ExtractedPasswords = Record<string, string[]>;
export type IncomingDataLeakDetails = Array<IncomingDataLeakBreachDetails>;
export interface GetLatestPublicBreachesResult {
  breaches: IncomingBreach[];
  revision: number;
}
export interface GetLatestPrivateBreachesResult {
  breaches: IncomingBreach[];
  refreshDate: number;
}
