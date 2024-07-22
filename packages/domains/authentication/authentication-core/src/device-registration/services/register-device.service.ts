import { firstValueFrom } from "rxjs";
import { CarbonLegacyClient, PersistData } from "@dashlane/communication";
import { Injectable } from "@dashlane/framework-application";
import {
  ContextlessServerApiClient,
  ServerApiClient,
} from "@dashlane/framework-dashlane-application";
import {
  failure,
  isFailure,
  isSuccess,
  match,
  panic,
  success,
} from "@dashlane/framework-types";
import { makeSafeCountry, makeSafeLanguage, secureDeviceName } from "./utils";
import { device as deviceUtil } from "@dashlane/browser-utils";
import { RegisterDeviceCommandErrors } from "@dashlane/authentication-contracts";
const INVALID_TOKEN_ERROR = {
  tag: "InvalidTokenError",
} satisfies RegisterDeviceCommandErrors;
const NETWORK_ERROR = {
  tag: "NetworkError",
} satisfies RegisterDeviceCommandErrors;
@Injectable()
export class RegisterDeviceService {
  public constructor(
    private serverApiClient: ServerApiClient,
    private carbon: CarbonLegacyClient,
    private contextless: ContextlessServerApiClient
  ) {}
  public async hasRegisteredDevice(login: string) {
    const list = await firstValueFrom(this.carbon.queries.getLocalAccounts());
    if (isFailure(list)) {
      throw new Error("Failed to query carbon");
    }
    return list.data.some((x) => x.login === login);
  }
  public async registerDeviceWithToken(
    login: string,
    token: string,
    deviceName?: string
  ) {
    const deviceVerificationResponse = await firstValueFrom(
      this.serverApiClient.v1.authentication.performExtraDeviceVerification({
        login,
        token,
      })
    );
    if (!isSuccess(deviceVerificationResponse)) {
      return failure(INVALID_TOKEN_ERROR);
    }
    const { authTicket } = deviceVerificationResponse.data.data;
    return this.registerDeviceWithTicket(login, authTicket, deviceName);
  }
  public async registerDeviceWithTicket(
    login: string,
    authTicket: string,
    deviceName?: string
  ) {
    const platformInfoResponse = await firstValueFrom(
      this.carbon.queries.getPlatformInfo()
    );
    if (!isSuccess(platformInfoResponse)) {
      throw new Error("Failed to get status from carbon");
    }
    const platformInfo = platformInfoResponse.data;
    if (platformInfo.platformName === "server_carbon_unknown") {
      throw new Error("unexpected server_carbon_unknown");
    }
    const device = {
      deviceName: secureDeviceName(
        deviceName ?? deviceUtil.getDefaultDeviceName()
      ),
      appVersion: platformInfo.appVersion,
      platform: platformInfo.platformName,
      osCountry: makeSafeCountry(platformInfo.country),
      osLanguage: makeSafeLanguage(platformInfo.lang),
      temporary: false,
    };
    const deviceRegistrationResponse = await firstValueFrom(
      this.serverApiClient.v1.authentication.completeDeviceRegistrationWithAuthTicket(
        { authTicket, login, device }
      )
    );
    if (!isSuccess(deviceRegistrationResponse)) {
      return match(deviceRegistrationResponse.error, {
        BusinessError: () => panic("Failed to register on server"),
        FetchFailedError: () => failure(NETWORK_ERROR),
        InternalServerError: () => panic("Failed to register on server"),
        InvalidRequest: () => panic("Failed to register on server"),
        RateLimited: () => panic("Failed to register on server"),
        ServiceUnavailable: () => panic("Failed to register on server"),
        UnspecifiedBadStatus: () => panic("Failed to register on server"),
      });
    }
    const { deviceAccessKey, deviceSecretKey, settings, serverKey } =
      deviceRegistrationResponse.data.data;
    return await this.registerDeviceWithKeys({
      deviceAccessKey,
      deviceSecretKey,
      login,
      settingsContent: settings.content,
      serverKey,
    });
  }
  public async registerDeviceWithKeys({
    deviceAccessKey,
    deviceSecretKey,
    settingsContent,
    serverKey,
    login,
  }: {
    deviceAccessKey: string;
    deviceSecretKey: string;
    settingsContent: string;
    serverKey?: string;
    login: string;
  }) {
    const accountInfos = await firstValueFrom(
      this.contextless.v1.account.accountInfo({
        deviceAccessKey,
        deviceSecretKey,
        login,
      })
    );
    if (!isSuccess(accountInfos)) {
      return match(accountInfos.error, {
        BusinessError: () => panic("Failed to get account infos"),
        FetchFailedError: () => failure(NETWORK_ERROR),
        InternalServerError: () => panic("Failed to get account infos"),
        InvalidRequest: () => panic("Failed to get account infos"),
        RateLimited: () => panic("Failed to get account infos"),
        ServiceUnavailable: () => panic("Failed to get account infos"),
        UnspecifiedBadStatus: () => panic("Failed to get account infos"),
      });
    }
    const {
      creationDateUnix,
      publicUserId,
      deviceAnalyticsId,
      userAnalyticsId,
    } = accountInfos.data.data;
    const carbonCommandResult = await this.carbon.commands.registerDevice({
      deviceAccessKey,
      deviceAnalyticsId: deviceAnalyticsId ?? "",
      deviceSecretKey,
      settings: {
        action: "BACKUP_EDIT",
        backupDate: creationDateUnix,
        content: settingsContent,
        identifier: "SETTINGS_userId",
        time: creationDateUnix,
        type: "SETTINGS",
      },
      serverKey,
      publicUserId,
      userAnalyticsId: userAnalyticsId ?? "",
      isDataPersisted: PersistData.PERSIST_DATA_YES,
      login,
    });
    if (isFailure(carbonCommandResult)) {
      throw new Error("Failed to register in carbon");
    }
    return success(undefined);
  }
}
