import { firstValueFrom } from "rxjs";
import { device as deviceUtil } from "@dashlane/browser-utils";
import { CarbonLegacyClient, PersistData } from "@dashlane/communication";
import { ServerApiClient } from "@dashlane/framework-dashlane-application";
import {
  CompleteDeviceRegistrationWithAuthTicketPayload,
  CompleteKeyExchangeBodyData,
  CompleteTransferBodyData,
  GetKeyExchangeTransferInfoBodyData,
  RequestTransferBodyData,
  StartReceiverKeyExchangeBodyData,
  StartSenderKeyExchangeBodyData,
  StartTransferBodyData,
} from "@dashlane/server-sdk/v1";
import { HttpStatusCode, Injectable } from "@dashlane/framework-application";
import {
  failure,
  isSuccess,
  mapFailureObservable,
  mapSuccessResultObservable,
  match,
  matchResultObservable,
  panic,
  Result,
  success,
} from "@dashlane/framework-types";
import { SessionClient } from "@dashlane/session-contracts";
import {
  AuthenticationFlowContracts,
  DeviceTransferContracts,
} from "@dashlane/authentication-contracts";
import {
  makeSafeCountry,
  makeSafeLanguage,
  secureDeviceName,
} from "../utils/utils";
import { DeviceToDeviceAuthenticationError } from "../../authentication-flow/flows/device-to-device-authentication-flow";
import { TrustedDeviceFlowError } from "../flows/trusted-device-flow";
@Injectable()
export class DeviceToDeviceAuthenticationService {
  public constructor(
    private serverApiClient: ServerApiClient,
    private sessionClient: SessionClient,
    private carbon: CarbonLegacyClient
  ) {}
  public async getCurrentUserLogin() {
    return await firstValueFrom(
      this.sessionClient.queries.selectedOpenedSession().pipe(
        mapFailureObservable(() => failure(new Error("No user login found"))),
        mapSuccessResultObservable((response) => {
          return success(response);
        })
      )
    );
  }
  public getUserInvisibleMasterPassword() {
    const { carbonState } = this.carbon.queries;
    return firstValueFrom(
      carbonState({
        path: "userSession.session.masterPassword",
      }).pipe(
        matchResultObservable({
          success: (response) => {
            return response as string;
          },
          failure: () => {
            throw new Error(
              "Failure getting user invisible master password info"
            );
          },
        })
      )
    );
  }
  public async requestAuthTicket() {
    return await firstValueFrom(
      this.serverApiClient.v1.authentication
        .requestExtraDeviceRegistration({
          tokenType: "googleAccountNewDevice",
        })
        .pipe(
          mapFailureObservable((response) => {
            return match(response, {
              BusinessError: () => failure(response),
              FetchFailedError: () => failure(response),
              UnspecifiedBadStatus: () => failure(response),
              InternalServerError: panic,
              InvalidRequest: panic,
              RateLimited: panic,
              ServiceUnavailable: panic,
            });
          }),
          mapSuccessResultObservable((response) => {
            return success(response.data.token);
          })
        )
    );
  }
  public async getKeyExchangeTransferInfo(): Promise<
    Result<GetKeyExchangeTransferInfoBodyData, Result<never, Error>>
  > {
    return await firstValueFrom(
      this.serverApiClient.v1.secretTransfer
        .getKeyExchangeTransferInfo({})
        .pipe(
          mapFailureObservable((response) => {
            return match(response, {
              BusinessError: () => failure(response),
              FetchFailedError: () => failure(response),
              UnspecifiedBadStatus: () => failure(response),
              InternalServerError: panic,
              InvalidRequest: panic,
              RateLimited: panic,
              ServiceUnavailable: panic,
            });
          }),
          mapSuccessResultObservable((response) => {
            return success(response.data);
          })
        )
    );
  }
  public async startReceiverKeyExchange(
    transferId: string,
    receiverHashedPublicKey: string
  ): Promise<
    Result<StartReceiverKeyExchangeBodyData, DeviceToDeviceAuthenticationError>
  > {
    return await firstValueFrom(
      this.serverApiClient.v1.secretTransfer
        .startReceiverKeyExchange(
          {
            transferId,
            receiverHashedPublicKey,
          },
          { timeout: 60000 }
        )
        .pipe(
          mapFailureObservable((result) => {
            return match(result, {
              BusinessError: panic,
              FetchFailedError: () => {
                throw new DeviceToDeviceAuthenticationError(
                  "User offline or request timeout",
                  AuthenticationFlowContracts.DeviceToDeviceAuthenticationErrors.TIMEOUT
                );
              },
              UnspecifiedBadStatus: ({ response }) => {
                if (response.status === HttpStatusCode.GatewayTimeout) {
                  return new DeviceToDeviceAuthenticationError(
                    "Request has timed out",
                    AuthenticationFlowContracts.DeviceToDeviceAuthenticationErrors.TIMEOUT
                  );
                }
                panic(result);
              },
              InternalServerError: panic,
              InvalidRequest: panic,
              RateLimited: panic,
              ServiceUnavailable: panic,
            });
          }),
          mapSuccessResultObservable((result) => {
            return success(result.data);
          })
        )
    );
  }
  public async completeKeyExchange(
    transferId: string,
    receiverPublicKey: string
  ): Promise<Result<CompleteKeyExchangeBodyData, Result<never, Error>>> {
    return await firstValueFrom(
      this.serverApiClient.v1.secretTransfer
        .completeKeyExchange({
          receiverPublicKey,
          transferId,
        })
        .pipe(
          mapFailureObservable((response) => {
            return match(response, {
              BusinessError: () => failure(response),
              FetchFailedError: () => failure(response),
              UnspecifiedBadStatus: () => failure(response),
              InternalServerError: panic,
              InvalidRequest: panic,
              RateLimited: panic,
              ServiceUnavailable: panic,
            });
          }),
          mapSuccessResultObservable((response) => {
            return success(response.data);
          })
        )
    );
  }
  public async startTransfer(
    transferId: string
  ): Promise<Result<StartTransferBodyData, DeviceToDeviceAuthenticationError>> {
    return await firstValueFrom(
      this.serverApiClient.v1.secretTransfer
        .startTransfer(
          {
            transferId,
            transferType: "universal",
          },
          { timeout: 60000 }
        )
        .pipe(
          mapFailureObservable((result) => {
            return match(result, {
              BusinessError: panic,
              FetchFailedError: panic,
              UnspecifiedBadStatus: ({ response }) => {
                if (response.status === HttpStatusCode.GatewayTimeout) {
                  return new DeviceToDeviceAuthenticationError(
                    "Request has timed out",
                    AuthenticationFlowContracts.DeviceToDeviceAuthenticationErrors.TIMEOUT
                  );
                }
                return panic(result);
              },
              InternalServerError: panic,
              InvalidRequest: panic,
              RateLimited: panic,
              ServiceUnavailable: panic,
            });
          }),
          mapSuccessResultObservable((result) => {
            return success(result.data);
          })
        )
    );
  }
  public async requestTransfer(
    loginEmail: string,
    deviceName: string
  ): Promise<Result<RequestTransferBodyData, Error>> {
    return await firstValueFrom(
      this.serverApiClient.v1.secretTransfer
        .requestTransfer({
          transfer: {
            login: loginEmail,
            receiverDeviceName: deviceName,
            transferType: "universal",
          },
        })
        .pipe(
          mapFailureObservable((response) => {
            return match(response, {
              BusinessError: () => {
                throw new Error("[D2D]: Business Error");
              },
              FetchFailedError: () => {
                throw new Error("[D2D]: Network error");
              },
              UnspecifiedBadStatus: panic,
              InternalServerError: panic,
              InvalidRequest: panic,
              RateLimited: panic,
              ServiceUnavailable: panic,
            });
          }),
          mapSuccessResultObservable((response) => {
            return success(response.data);
          })
        )
    );
  }
  public async startSenderKeyExchange(
    transferId: string,
    senderPublicKey: string
  ): Promise<Result<StartSenderKeyExchangeBodyData, TrustedDeviceFlowError>> {
    return await firstValueFrom(
      this.serverApiClient.v1.secretTransfer
        .startSenderKeyExchange(
          {
            transferId,
            senderPublicKey,
          },
          { timeout: 60000 }
        )
        .pipe(
          mapFailureObservable((result) => {
            return match(result, {
              BusinessError: (error) => {
                if (error.code === "TRANSFER_DOES_NOT_EXISTS") {
                  throw new TrustedDeviceFlowError(
                    "Transfer request has expired",
                    DeviceTransferContracts.TrustedDeviceFlowErrors.TIMEOUT
                  );
                }
                throw new Error("[D2D]: Business Error");
              },
              FetchFailedError: () => {
                throw new Error("[D2D]: Network error");
              },
              UnspecifiedBadStatus: ({ response }) => {
                if (response.status === HttpStatusCode.GatewayTimeout) {
                  return new TrustedDeviceFlowError(
                    "Request has timed out",
                    DeviceTransferContracts.TrustedDeviceFlowErrors.TIMEOUT
                  );
                }
                throw new Error("[D2D]: Bad status error");
              },
              InternalServerError: panic,
              InvalidRequest: panic,
              RateLimited: panic,
              ServiceUnavailable: panic,
            });
          }),
          mapSuccessResultObservable((result) => {
            return success(result.data);
          })
        )
    );
  }
  public async completeTransfer(
    encryptedData: string,
    nonce: string,
    transferId: string
  ): Promise<Result<CompleteTransferBodyData, TrustedDeviceFlowError>> {
    return await firstValueFrom(
      this.serverApiClient.v1.secretTransfer
        .completeTransfer({
          transfer: {
            encryptedData,
            nonce,
            transferId,
            transferType: "universal",
          },
        })
        .pipe(
          mapFailureObservable((response) => {
            return match(response, {
              BusinessError: (error) => {
                if (error.error.code === "TRANSFER_DOES_NOT_EXISTS") {
                  return new TrustedDeviceFlowError(
                    "Request timed out",
                    DeviceTransferContracts.TrustedDeviceFlowErrors.TIMEOUT
                  );
                }
                throw new Error("[D2D]: Business Error");
              },
              FetchFailedError: () => {
                throw new Error("[D2D]: Network error");
              },
              UnspecifiedBadStatus: panic,
              InternalServerError: panic,
              InvalidRequest: panic,
              RateLimited: panic,
              ServiceUnavailable: panic,
            });
          }),
          mapSuccessResultObservable((response) => {
            return success(response.data);
          })
        )
    );
  }
  public async openSession(
    login: string,
    token: string,
    password: string,
    deviceName?: string
  ) {
    const deviceVerificationResponse = await firstValueFrom(
      this.serverApiClient.v1.authentication.performExtraDeviceVerification({
        login,
        token,
      })
    );
    if (!isSuccess(deviceVerificationResponse)) {
      throw new DeviceToDeviceAuthenticationError(
        "Perform extra device verification failed",
        AuthenticationFlowContracts.DeviceToDeviceAuthenticationErrors.ACCOUNT_ERROR
      );
    }
    const { authTicket } = deviceVerificationResponse.data.data;
    const platformInfoResponse = await firstValueFrom(
      this.carbon.queries.getPlatformInfo()
    );
    if (!isSuccess(platformInfoResponse)) {
      throw new DeviceToDeviceAuthenticationError(
        "No platform info available",
        AuthenticationFlowContracts.DeviceToDeviceAuthenticationErrors.ACCOUNT_ERROR
      );
    }
    const platformInfo = platformInfoResponse.data;
    const device = {
      deviceName: secureDeviceName(
        deviceName || deviceUtil.getDefaultDeviceName()
      ),
      appVersion: platformInfo.appVersion,
      platform:
        platformInfo.platformName as CompleteDeviceRegistrationWithAuthTicketPayload["device"]["platform"],
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
      throw new DeviceToDeviceAuthenticationError(
        "Device registration with authTicket failed",
        AuthenticationFlowContracts.DeviceToDeviceAuthenticationErrors.ACCOUNT_ERROR
      );
    }
    const {
      deviceAccessKey,
      deviceAnalyticsId,
      deviceSecretKey,
      settings,
      serverKey,
      publicUserId,
      userAnalyticsId,
    } = deviceRegistrationResponse.data.data;
    await this.carbon.commands.registerDevice({
      deviceAccessKey,
      deviceAnalyticsId,
      deviceSecretKey,
      settings,
      serverKey,
      publicUserId,
      userAnalyticsId,
      isDataPersisted: PersistData.PERSIST_DATA_YES,
      login,
    });
    const openSessionResult =
      await this.carbon.commands.openSessionWithMasterPassword({
        login,
        password,
        rememberPassword: true,
        requiredPermissions: undefined,
        serverKey: "",
        loginType: "DeviceToDevice",
      });
    if (!isSuccess(openSessionResult)) {
      throw new DeviceToDeviceAuthenticationError(
        "Open session with deciphered password failed",
        AuthenticationFlowContracts.DeviceToDeviceAuthenticationErrors.ACCOUNT_ERROR
      );
    }
  }
}
