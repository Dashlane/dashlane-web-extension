import { Session as SessionState } from "Session/Store/session";
export interface SessionKeys {
  accessKey: string;
  secretKey: string;
  expirationTimeSeconds: number;
}
export interface AnalyticsIds {
  userAnalyticsId: string;
  deviceAnalyticsId: string;
}
export type SessionEncryptorKeys = Pick<
  SessionState,
  "masterPassword" | "serverKey" | "localKey" | "remoteKey"
>;
