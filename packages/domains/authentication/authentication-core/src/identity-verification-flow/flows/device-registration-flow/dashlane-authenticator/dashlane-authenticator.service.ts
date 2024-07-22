import { Injectable } from "@dashlane/framework-application";
import { IdentityVerificationEventsEmitter } from "../../../handlers/events";
import { IdentityVerificationService } from "../../../services/identity-verification.service";
import { isFailure } from "@dashlane/framework-types";
import {
  DashlaneAuthenticatorErrorCode,
  DefaultErrorCode,
  FunctionalErrorName,
  PerformDashlaneAuthenticatorVerificationError,
} from "../../../types/errors";
interface Params {
  login?: string;
}
@Injectable()
export class DashlaneAuthenticatorService {
  private identityVerificationService: IdentityVerificationService;
  private eventEmitter: IdentityVerificationEventsEmitter;
  public constructor(
    identityVerificationService: IdentityVerificationService,
    eventEmitter: IdentityVerificationEventsEmitter
  ) {
    this.identityVerificationService = identityVerificationService;
    this.eventEmitter = eventEmitter;
  }
  private mapFunctionalErrorToErrorCode(
    error: PerformDashlaneAuthenticatorVerificationError
  ): DashlaneAuthenticatorErrorCode | DefaultErrorCode {
    switch (error.tag) {
      case FunctionalErrorName.VERIFICATION_FAILED:
        return DashlaneAuthenticatorErrorCode.DASHLANE_AUTHENTICATOR_PUSH_NOTIFICATION_DENIED;
      case FunctionalErrorName.VERIFICATION_TIMEOUT:
        return DashlaneAuthenticatorErrorCode.TOKEN_EXPIRED;
      default:
        return DefaultErrorCode.UNKNOWN_ERROR;
    }
  }
  public async execute({ login }: Params) {
    if (!login) {
      throw new Error("Something went wrong");
    }
    const result =
      await this.identityVerificationService.performDashlaneAuthenticatorValidation(
        login,
        ""
      );
    if (isFailure(result)) {
      const errorCode = this.mapFunctionalErrorToErrorCode(result.error);
      return Promise.reject(errorCode);
    }
    this.eventEmitter.sendEvent("identityVerificationCompleted", {
      authTicket: result.data,
    });
    return Promise.resolve();
  }
}
