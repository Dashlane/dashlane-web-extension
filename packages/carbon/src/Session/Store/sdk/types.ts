export interface AppKeys {
  accessKey: string;
  secretKey: string;
}
export interface SdkAuthentication {
  anonymousPartnerId: string;
  dashlaneServerDeltaTimestamp: number;
  appKeys: AppKeys;
  styxKeys: AppKeys;
}
