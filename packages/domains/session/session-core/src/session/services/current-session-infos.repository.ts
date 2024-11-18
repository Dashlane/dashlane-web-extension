import { Observable, switchMap } from "rxjs";
import {
  CarbonLegacyClient,
  UserCryptoSettings,
} from "@dashlane/communication";
import { Injectable } from "@dashlane/framework-application";
import { isSuccess, safeCast } from "@dashlane/framework-types";
import { SessionInfo } from "@dashlane/session-contracts";
export interface CarbonDeviceKeys {
  readonly accessKey: string;
  readonly secretKey: string;
}
type SessionExtendedInfo = SessionInfo & {
  cryptoSettings: Required<
    Pick<UserCryptoSettings, "cryptoFixedSalt" | "cryptoUserPayload">
  >;
};
function convertUkiToDeviceKeys(uki: string): CarbonDeviceKeys {
  const keys: string[] = uki.split("-");
  if (keys.length > 0) {
    const [accessKey] = keys;
    return {
      accessKey,
      secretKey: uki,
    };
  }
  throw new Error("Invalid UKI format");
}
function areCarbonDeviceKeys(
  carbonState: unknown
): carbonState is CarbonDeviceKeys {
  if (
    !carbonState ||
    typeof carbonState !== "object" ||
    !("accessKey" in carbonState) ||
    !("secretKey" in carbonState)
  ) {
    return false;
  }
  return (
    typeof carbonState.accessKey === "string" &&
    typeof carbonState.secretKey === "string"
  );
}
function isCarbonUki(carbonState: unknown): carbonState is string {
  return typeof carbonState === "string";
}
function getDeviceKeys(deviceKeys: unknown, uki: unknown) {
  if (areCarbonDeviceKeys(deviceKeys)) {
    return deviceKeys;
  }
  if (isCarbonUki(uki)) {
    return convertUkiToDeviceKeys(uki);
  }
  throw new Error("unable to get device keys");
}
const USER_DEVICE_KEYS_CARBON_PATH = "authentication.currentUser.deviceKeys";
const UKI_CARBON_PATH = "userSession.localSettings.uki";
const CURRENT_USER_LOGIN_CARBON_PATH = "userSession.account.login";
const CURRENT_USER_ANALYTICS_IDS = "userSession.session.analyticsIds";
const CURRENT_USER_PUBLIC_ID = "userSession.session.publicUserId";
const CURRENT_USER_CRYPTO_PAYLOAD =
  "userSession.personalSettings.CryptoUserPayload";
const CURRENT_USER_CRYPTO_SALT = "userSession.personalSettings.CryptoFixedSalt";
interface AnalyticsIds {
  userAnalyticsId: string;
  deviceAnalyticsId: string;
}
function isAnalyticsIds(x: unknown): x is AnalyticsIds {
  return (
    !!x &&
    typeof x === "object" &&
    "userAnalyticsId" in x &&
    "deviceAnalyticsId" in x &&
    typeof x.userAnalyticsId === "string" &&
    typeof x.deviceAnalyticsId === "string"
  );
}
@Injectable()
export class CurrentSessionInfoRepository {
  constructor(private readonly carbon: CarbonLegacyClient) {}
  getInfos(): Observable<SessionExtendedInfo> {
    return this.carbon.queries
      .carbonStateList({
        paths: [
          CURRENT_USER_LOGIN_CARBON_PATH,
          USER_DEVICE_KEYS_CARBON_PATH,
          UKI_CARBON_PATH,
          CURRENT_USER_ANALYTICS_IDS,
          CURRENT_USER_PUBLIC_ID,
          CURRENT_USER_CRYPTO_PAYLOAD,
          CURRENT_USER_CRYPTO_SALT,
        ],
      })
      .pipe(
        switchMap(async (v) => {
          if (!isSuccess(v)) {
            throw new Error("failed to get carbon data");
          }
          const [
            login,
            maybeDeviceKeys,
            maybeUki,
            analyticsIds,
            publicUserId,
            cryptoUserPayload,
            cryptoFixedSalt,
          ] = v.data as [
            string,
            unknown,
            unknown,
            AnalyticsIds,
            string,
            string,
            string
          ];
          if (!isAnalyticsIds(analyticsIds)) {
            throw new Error("analytics not of type string");
          }
          const deviceKeys = getDeviceKeys(maybeDeviceKeys, maybeUki);
          return safeCast<SessionExtendedInfo>({
            login: String(login),
            deviceAccessKey: deviceKeys.accessKey,
            analytics: {
              deviceId: analyticsIds.deviceAnalyticsId,
              userId: analyticsIds.userAnalyticsId,
            },
            deviceKeys,
            publicUserId,
            cryptoSettings: { cryptoUserPayload, cryptoFixedSalt },
          });
        })
      );
  }
}
