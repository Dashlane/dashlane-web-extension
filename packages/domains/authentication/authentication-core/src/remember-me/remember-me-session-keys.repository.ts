import { CarbonLegacyClient } from "@dashlane/communication";
import { Injectable } from "@dashlane/framework-application";
import { getSuccess, isFailure } from "@dashlane/framework-types";
import { RequestSessionCredentials } from "@dashlane/server-sdk";
import { firstValueFrom, map } from "rxjs";
interface CarbonDeviceKeys {
  readonly accessKey: string;
  readonly secretKey: string;
}
interface CarbonSessionKeys {
  readonly accessKey: string;
  readonly secretKey: string;
  readonly expirationTimeSeconds: number;
}
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
function areCarbonSessionKeys(
  carbonState: unknown
): carbonState is CarbonSessionKeys {
  if (
    !carbonState ||
    typeof carbonState !== "object" ||
    !("accessKey" in carbonState) ||
    !("secretKey" in carbonState) ||
    !("expirationTimeSeconds" in carbonState)
  ) {
    return false;
  }
  return (
    typeof carbonState.accessKey === "string" &&
    typeof carbonState.secretKey === "string" &&
    typeof carbonState.expirationTimeSeconds === "number"
  );
}
const USER_DEVICE_KEYS_CARBON_PATH = "authentication.currentUser.deviceKeys";
const USER_SESSION_KEYS_CARBON_PATH = "userSession.session.sessionKeys";
const UKI_CARBON_PATH = "userSession.localSettings.uki";
const CURRENT_USER_LOGIN_CARBON_PATH = "userSession.account.login";
@Injectable()
export class RememberMeSessionKeysRepository {
  constructor(private readonly carbon: CarbonLegacyClient) {}
  public getSessionCredentialsForUser(
    userName: string
  ): Promise<RequestSessionCredentials> {
    const {
      queries: { carbonStateList },
    } = this.carbon;
    return firstValueFrom(
      carbonStateList({
        paths: [
          USER_DEVICE_KEYS_CARBON_PATH,
          UKI_CARBON_PATH,
          CURRENT_USER_LOGIN_CARBON_PATH,
          USER_SESSION_KEYS_CARBON_PATH,
        ],
      }).pipe(
        map((result) => {
          if (isFailure(result)) {
            throw new Error("Failed to get credentials from carbon");
          }
          return getSuccess(result);
        }),
        map(this.carbonStateToRequestUserSessionCredentials(userName))
      )
    );
  }
  private carbonStateToRequestUserSessionCredentials(userName: string) {
    return ([
      userDeviceKeys,
      uki,
      login,
      sessionKeys,
    ]: unknown[]): RequestSessionCredentials => {
      if ((!userDeviceKeys && !uki) || login !== userName) {
        throw new Error("No user device credentials available for active user");
      }
      if (!sessionKeys) {
        throw new Error("No session credentials available for active user");
      }
      let deviceKeys: CarbonDeviceKeys;
      if (uki) {
        if (!isCarbonUki(uki)) {
          throw new Error("Unexpected UKI state shape received from carbon");
        }
        deviceKeys = convertUkiToDeviceKeys(uki);
      } else {
        if (!areCarbonDeviceKeys(userDeviceKeys)) {
          throw new Error(
            "Unexpected user device state shape received from carbon"
          );
        }
        deviceKeys = userDeviceKeys;
      }
      if (!areCarbonSessionKeys(sessionKeys)) {
        throw new Error(
          "Unexpected session keys state shape received from carbon"
        );
      }
      return {
        login: userName,
        deviceAccessKey: deviceKeys.accessKey,
        sessionAccessKey: sessionKeys.accessKey,
        sessionSecretKey: sessionKeys.secretKey,
      };
    };
  }
}
