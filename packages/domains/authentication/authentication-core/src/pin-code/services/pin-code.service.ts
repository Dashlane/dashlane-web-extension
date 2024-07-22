import {
  createNoActivePinCodeError,
  createWrongPinCodeError,
  GetStatusQueryResult,
  LoginWithPinError,
} from "@dashlane/authentication-contracts";
import { CarbonLegacyClient } from "@dashlane/communication";
import { AllowedToFail, Injectable } from "@dashlane/framework-application";
import {
  HmacSigner,
  KeyGeneratorAes256,
  ServerApiClient,
} from "@dashlane/framework-dashlane-application";
import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  base64UrlToArrayBuffer,
} from "@dashlane/framework-encoding";
import {
  assertUnreachable,
  failure,
  isSuccess,
  match,
  panic,
  Result,
  success,
} from "@dashlane/framework-types";
import { SessionClient } from "@dashlane/session-contracts";
import {
  combineLatest,
  filter,
  firstValueFrom,
  map,
  Observable,
  throwError,
  timeout,
} from "rxjs";
import { getOpaqueClient } from "../libs/opaque";
import { PinCodeState, PinCodeStore } from "../stores/pin-code.store";
import { SessionKeyCrypto } from "./session-key-crypto.service";
import { PinCodeServerConfigResourceLoader } from "./pin-code-server-configs.resource-loader";
@Injectable()
export class PinCodeService {
  constructor(
    private readonly pinCodeStore: PinCodeStore,
    private readonly session: SessionClient,
    private readonly keyGenerator: KeyGeneratorAes256,
    private readonly hmacSigner: HmacSigner,
    private readonly sessionKeyCrypto: SessionKeyCrypto,
    private readonly serverApi: ServerApiClient,
    private readonly allowToFail: AllowedToFail,
    private readonly carbonClient: CarbonLegacyClient,
    private readonly pinCodeServerConfigResourceLoader: PinCodeServerConfigResourceLoader
  ) {}
  public getPinCodeStatus(
    email: string
  ): Observable<Result<GetStatusQueryResult>> {
    return this.pinCodeStore.state$.pipe(
      map((state: PinCodeState) => {
        const isPinCodeEnabled = email in state.localAccounts;
        return success(
          isPinCodeEnabled
            ? {
                isPinCodeEnabled: true,
                attemptsLeft: state.localAccounts[email].attemptsLeft,
              }
            : { isPinCodeEnabled: false }
        );
      })
    );
  }
  public getCurrentUserPinCodeStatus(): Observable<
    Result<GetStatusQueryResult>
  > {
    const currentSession$ = this.session.queries.selectedOpenedSession().pipe(
      timeout({
        first: 5000,
        with: () => throwError(() => new Error("No current active user")),
      }),
      map((login) => {
        if (!isSuccess(login) || !login.data) {
          return "";
        }
        return login.data;
      }),
      filter((user) => !!user)
    );
    return combineLatest([currentSession$, this.pinCodeStore.state$]).pipe(
      map(([loggedInUser, pinCodeState]) => {
        const isPinCodeEnabled = loggedInUser in pinCodeState.localAccounts;
        return success(
          isPinCodeEnabled
            ? {
                isPinCodeEnabled: true,
                attemptsLeft:
                  pinCodeState.localAccounts[loggedInUser].attemptsLeft,
              }
            : { isPinCodeEnabled: false }
        );
      })
    );
  }
  public async activatePinCode(pinCode: string) {
    const email = await this.getCurrentUserEmail();
    const autologinStatus = await firstValueFrom(
      this.carbonClient.queries.carbonState({
        path: `state.authentication.currentUser.rememberMeType`,
      })
    );
    if (isSuccess(autologinStatus) && autologinStatus.data === "autologin") {
      await this.carbonClient.commands.disableAutologin();
    }
    const previousState = await this.pinCodeStore.getState();
    const sessionKey = await this.getExportedSessionKey();
    const salt = arrayBufferToBase64(await this.keyGenerator.generate());
    const client = await getOpaqueClient();
    const pinCodeWithSalt = arrayBufferToBase64(
      await this.hmacSigner.sign(
        base64ToArrayBuffer(salt),
        new TextEncoder().encode(pinCode)
      )
    );
    const { clientRegistrationState, registrationRequest } =
      client.startRegistration({
        password: pinCodeWithSalt,
      });
    const responseRequestActivation = await firstValueFrom(
      this.serverApi.v1.authentication.pincodeRequestActivation({
        activationRequest: registrationRequest,
      })
    );
    const activationResponse = match(responseRequestActivation, {
      success: (a) => a.data.data.activationResponse,
      failure: (f) =>
        match(f.error, {
          BusinessError: (b) => {
            switch (b.code) {
              case "FAILED_TO_PROCESS_ACTIVATION_REQUEST":
                return panic(b.code);
              case "SSO_USER_NOT_ALLOWED":
                return panic(b.code);
              default:
                assertUnreachable(b);
            }
          },
          FetchFailedError: panic,
          InternalServerError: panic,
          InvalidRequest: panic,
          RateLimited: panic,
          ServiceUnavailable: panic,
          UnspecifiedBadStatus: panic,
        }),
    });
    const serverConfigs = await this.pinCodeServerConfigResourceLoader.get();
    const { registrationRecord, exportKey, serverStaticPublicKey } =
      client.finishRegistration({
        clientRegistrationState,
        registrationResponse: activationResponse,
        password: pinCodeWithSalt,
        identifiers: {
          client: email,
          server: serverConfigs.serverIdentifier,
        },
      });
    if (serverStaticPublicKey !== serverConfigs.serverPublicKey) {
      throw new Error(
        "OPAQUE´s serverStaticPublicKey does not match api configs."
      );
    }
    const completeActivationResponse = await firstValueFrom(
      this.serverApi.v1.authentication.pincodeCompleteActivation({
        pinCodeRecord: registrationRecord,
      })
    );
    const serverSessionKey = match(completeActivationResponse, {
      success: (s) => s.data.data.sessionKey,
      failure: (f) =>
        match(f.error, {
          BusinessError: (b) => {
            switch (b.code) {
              case "ACTIVATION_REQUEST_NOT_FOUND":
              case "EMPTY_PIN_CODE_RECORD":
                return panic(b.code);
              default:
                assertUnreachable(b);
            }
          },
          FetchFailedError: panic,
          InternalServerError: panic,
          InvalidRequest: panic,
          RateLimited: panic,
          ServiceUnavailable: panic,
          UnspecifiedBadStatus: panic,
        }),
    });
    const pinKey = base64UrlToArrayBuffer(exportKey);
    const encryptedSessionKey =
      await this.sessionKeyCrypto.encryptSessionKeyWithPinKey(
        sessionKey,
        pinKey
      );
    await this.pinCodeStore.set({
      ...previousState,
      localAccounts: {
        ...previousState.localAccounts,
        [email]: {
          ...previousState.localAccounts[email],
          serverSessionKey,
          salt,
          encryptedSessionKey: arrayBufferToBase64(encryptedSessionKey),
          attemptsLeft: 3,
        },
      },
    });
  }
  private async removePinCodeFromStore(email: string) {
    const state: PinCodeState = await this.pinCodeStore.getState();
    delete state.localAccounts[email];
    await this.pinCodeStore.set(state);
  }
  public async deactivatePinCode() {
    const email = await this.getCurrentUserEmail();
    const state = await this.pinCodeStore.getState();
    if (!(email in state.localAccounts)) {
      return;
    }
    await this.removePinCodeFromStore(email);
    await this.allowToFail.doOne(
      async () =>
        await firstValueFrom(
          this.serverApi.v1.authentication.pincodeDisable({})
        ),
      "Deactivate pin code"
    );
  }
  public async computePinKey(
    pinCode: string,
    email: string
  ): Promise<Result<ArrayBuffer, LoginWithPinError>> {
    const state = await this.pinCodeStore.getState();
    if (!(email in state.localAccounts)) {
      return failure(createNoActivePinCodeError());
    }
    const { serverSessionKey, salt } = state.localAccounts[email];
    const pinCodeWithSalt = arrayBufferToBase64(
      await this.hmacSigner.sign(
        base64ToArrayBuffer(salt),
        new TextEncoder().encode(pinCode)
      )
    );
    const client = await getOpaqueClient();
    const { clientLoginState, startLoginRequest } = client.startLogin({
      password: pinCodeWithSalt,
    });
    const requestLoginResponse = await firstValueFrom(
      this.serverApi.v1.authentication.pincodeRequestLogin({
        loginRequest: startLoginRequest,
        sessionKey: serverSessionKey,
      })
    );
    const requestLoginResponseResult = match(requestLoginResponse, {
      success: (r) => success(r.data.data),
      failure: (f) =>
        match(f.error, {
          BusinessError: (b) => {
            switch (b.code) {
              case "INVALID_SESSION_KEY":
              case "NO_PIN_CODE_ACTIVATED":
              case "FAILED_TO_PROCESS_LOGIN_REQUEST":
              case "MAX_ATTEMPTS_REACHED":
                return failure(createNoActivePinCodeError());
              default:
                assertUnreachable(b);
            }
          },
          FetchFailedError: panic,
          InternalServerError: panic,
          InvalidRequest: panic,
          RateLimited: panic,
          ServiceUnavailable: panic,
          UnspecifiedBadStatus: panic,
        }),
    });
    if (!isSuccess(requestLoginResponseResult)) {
      await this.removePinCodeFromStore(email);
      return requestLoginResponseResult;
    }
    const { loginResponse, attemptsLeft } = requestLoginResponseResult.data;
    const previousState = await this.pinCodeStore.getState();
    await this.pinCodeStore.set({
      ...previousState,
      localAccounts: {
        ...previousState.localAccounts,
        [email]: {
          ...previousState.localAccounts[email],
          attemptsLeft,
        },
      },
    });
    const serverConfigs = await this.pinCodeServerConfigResourceLoader.get();
    const loginResult = client.finishLogin({
      clientLoginState,
      loginResponse,
      password: pinCodeWithSalt,
      identifiers: {
        client: email,
        server: serverConfigs.serverIdentifier,
      },
    });
    if (!loginResult) {
      if (attemptsLeft === 0) {
        await this.removePinCodeFromStore(email);
      }
      return failure(createWrongPinCodeError());
    }
    if (loginResult.serverStaticPublicKey !== serverConfigs.serverPublicKey) {
      throw new Error(
        "OPAQUE´s serverStaticPublicKey does not match api configs."
      );
    }
    const { exportKey: pinKey, finishLoginRequest } = loginResult;
    await this.allowToFail.doOne(
      async () =>
        await firstValueFrom(
          this.serverApi.v1.authentication.pincodeCompleteLogin({
            sessionKey: serverSessionKey,
            completeLoginRequest: finishLoginRequest,
          })
        ),
      "Complete login with pin code"
    );
    return success(base64UrlToArrayBuffer(pinKey));
  }
  public async loginWithPinCode(
    email: string,
    pinCode: string
  ): Promise<Result<undefined, LoginWithPinError>> {
    const state = await this.pinCodeStore.getState();
    if (!(email in state.localAccounts)) {
      return failure(createNoActivePinCodeError());
    }
    const { encryptedSessionKey } = state.localAccounts[email];
    const pinKeyRequest = await this.computePinKey(pinCode, email);
    if (!isSuccess(pinKeyRequest)) {
      return pinKeyRequest;
    }
    const pinKey = pinKeyRequest.data;
    const sessionKey = await this.sessionKeyCrypto.decryptSessionKeyWithPinKey(
      base64ToArrayBuffer(encryptedSessionKey),
      pinKey
    );
    const openUserSessionCommandResult =
      await this.session.commands.openUserSession({
        email,
        rememberPassword: false,
        sessionKey: {
          type: "exported",
          content: arrayBufferToBase64(sessionKey),
        },
      });
    if (!isSuccess(openUserSessionCommandResult)) {
      throw new Error("Failed to open the session");
    }
    return success(undefined);
  }
  private async getCurrentUserEmail() {
    const currentSession = await firstValueFrom(
      this.session.queries.selectedOpenedSession()
    );
    if (!isSuccess(currentSession) || !currentSession.data) {
      throw new Error("No current session was found");
    }
    return currentSession.data;
  }
  private async getExportedSessionKey() {
    const query = await firstValueFrom(this.session.queries.exportSessionKey());
    if (!isSuccess(query)) {
      throw new Error("Failed to export session key");
    }
    return base64ToArrayBuffer(query.data.content);
  }
}
