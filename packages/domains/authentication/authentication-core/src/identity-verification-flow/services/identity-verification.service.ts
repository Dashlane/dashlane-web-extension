import { firstValueFrom } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { ServerApiClient } from "@dashlane/framework-dashlane-application";
import {
  assertUnreachable,
  mapFailureObservable,
  mapSuccessResultObservable,
  match,
  panic,
  Result,
  success,
} from "@dashlane/framework-types";
import {
  AccountBlockedContactSupportError,
  FunctionalErrorName,
  InvalidOTPAlreadyUsedError,
  InvalidOTPBlockedError,
  NetworkError,
  PerformDashlaneAuthenticatorVerificationError,
  PerformEmailTokenVerificationError,
  PerformTotpVerificationError,
  VerificationFailedError,
  VerificationRequiresRequestError,
  VerificationTimeoutError,
} from "../types/errors";
@Injectable()
export class IdentityVerificationService {
  private serverApiClient: ServerApiClient;
  public constructor(serverApiClient: ServerApiClient) {
    this.serverApiClient = serverApiClient;
  }
  public async performEmailTokenVerification(
    login: string,
    token: string
  ): Promise<Result<string, PerformEmailTokenVerificationError>> {
    return await firstValueFrom(
      this.serverApiClient.v1.authentication
        .performEmailTokenVerification({ login, token })
        .pipe(
          mapFailureObservable((error) => {
            return match(error, {
              BusinessError: (
                businessError
              ): PerformEmailTokenVerificationError => {
                switch (businessError.code) {
                  case FunctionalErrorName.VERIFICATION_FAILED:
                    return new VerificationFailedError();
                  case FunctionalErrorName.VERIFICATION_TIMEOUT:
                    return new VerificationTimeoutError();
                  case FunctionalErrorName.VERIFICATION_REQUIRES_REQUEST:
                    return new VerificationRequiresRequestError();
                  case FunctionalErrorName.ACCOUNT_BLOCKED_CONTACT_SUPPORT:
                    return new AccountBlockedContactSupportError();
                  default:
                    assertUnreachable(businessError.code as never);
                }
              },
              FetchFailedError: () => {
                return new NetworkError();
              },
              UnspecifiedBadStatus: panic,
              InternalServerError: panic,
              InvalidRequest: panic,
              RateLimited: panic,
              ServiceUnavailable: panic,
            });
          }),
          mapSuccessResultObservable((response) => {
            return success(response.data.authTicket);
          })
        )
    );
  }
  public async performTotpVerification(
    login: string,
    otp: string
  ): Promise<Result<string, PerformTotpVerificationError>> {
    return await firstValueFrom(
      this.serverApiClient.v1.authentication
        .performTotpVerification({ login, otp })
        .pipe(
          mapFailureObservable((error) => {
            return match(error, {
              BusinessError: (businessError): PerformTotpVerificationError => {
                switch (businessError.code) {
                  case FunctionalErrorName.VERIFICATION_FAILED:
                    return new VerificationFailedError();
                  case FunctionalErrorName.INVALID_OTP_ALREADY_USED:
                    return new InvalidOTPAlreadyUsedError();
                  case FunctionalErrorName.INVALID_OTP_BLOCKED:
                    return new InvalidOTPBlockedError();
                  default:
                    assertUnreachable(businessError.code as never);
                }
              },
              FetchFailedError: () => {
                return new NetworkError();
              },
              UnspecifiedBadStatus: panic,
              InternalServerError: panic,
              InvalidRequest: panic,
              RateLimited: panic,
              ServiceUnavailable: panic,
            });
          }),
          mapSuccessResultObservable((response) => {
            return success(response.data.authTicket);
          })
        )
    );
  }
  public async performDashlaneAuthenticatorValidation(
    login: string,
    deviceName: string
  ): Promise<Result<string, PerformDashlaneAuthenticatorVerificationError>> {
    return await firstValueFrom(
      this.serverApiClient.v1.authentication
        .performDashlaneAuthenticatorVerification({ login, deviceName })
        .pipe(
          mapFailureObservable((error) => {
            return match(error, {
              BusinessError: (
                businessError
              ): PerformDashlaneAuthenticatorVerificationError => {
                switch (businessError.code) {
                  case FunctionalErrorName.VERIFICATION_FAILED:
                    return new VerificationFailedError();
                  case FunctionalErrorName.VERIFICATION_TIMEOUT:
                    return new VerificationTimeoutError();
                  default:
                    assertUnreachable(businessError.code as never);
                }
              },
              FetchFailedError: () => {
                return new NetworkError();
              },
              UnspecifiedBadStatus: panic,
              InternalServerError: panic,
              InvalidRequest: panic,
              RateLimited: panic,
              ServiceUnavailable: panic,
            });
          }),
          mapSuccessResultObservable((response) => {
            return success(response.data.authTicket);
          })
        )
    );
  }
  public async askServerToSendToken(
    login: string
  ): Promise<Result<undefined, void>> {
    return await firstValueFrom(
      this.serverApiClient.v1.authentication
        .requestEmailTokenVerification({ login })
        .pipe(
          mapFailureObservable((error) => {
            throw error;
          }),
          mapSuccessResultObservable(() => {
            return success(undefined);
          })
        )
    );
  }
}
