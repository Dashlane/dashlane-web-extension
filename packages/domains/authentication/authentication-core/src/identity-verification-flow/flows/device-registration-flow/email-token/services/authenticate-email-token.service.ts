import { Injectable } from "@dashlane/framework-application";
import { isFailure } from "@dashlane/framework-types";
import { IdentityVerificationEventsEmitter } from "../../../../handlers/events/events-emitter";
import { IdentityVerificationService } from "../../../../services/identity-verification.service";
import {
  DefaultErrorCode,
  EmailTokenErrorCode,
  FunctionalErrorName,
  PerformEmailTokenVerificationError,
} from "../../../../types/errors";
import { DASHLANE_OTP_REGEX } from "../../../../utils/constants";
interface Params {
  deviceName?: string;
  emailToken?: string;
  login?: string;
}
@Injectable()
export class AuthenticateWithEmailToken {
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
    error: PerformEmailTokenVerificationError
  ): EmailTokenErrorCode | DefaultErrorCode {
    switch (error.tag) {
      case FunctionalErrorName.VERIFICATION_FAILED:
        return EmailTokenErrorCode.TOKEN_NOT_VALID;
      case FunctionalErrorName.VERIFICATION_TIMEOUT:
        return EmailTokenErrorCode.TOKEN_EXPIRED;
      case FunctionalErrorName.VERIFICATION_REQUIRES_REQUEST:
        return EmailTokenErrorCode.TOKEN_TOO_MANY_ATTEMPTS;
      case FunctionalErrorName.ACCOUNT_BLOCKED_CONTACT_SUPPORT:
        return EmailTokenErrorCode.TOKEN_ACCOUNT_LOCKED;
      default:
        return DefaultErrorCode.UNKNOWN_ERROR;
    }
  }
  public async executeWithParams(context: Params) {
    if (
      !context.login ||
      !context.emailToken ||
      context.emailToken.length === 0 ||
      !DASHLANE_OTP_REGEX.test(context.emailToken)
    ) {
      return Promise.reject(DefaultErrorCode.UNKNOWN_ERROR);
    }
    const verificationResult =
      await this.identityVerificationService.performEmailTokenVerification(
        context.login,
        context.emailToken
      );
    if (isFailure(verificationResult)) {
      const errorCode = this.mapFunctionalErrorToErrorCode(
        verificationResult.error
      );
      return Promise.reject(errorCode);
    }
    const authTicket = verificationResult.data;
    this.eventEmitter.sendEvent("identityVerificationCompleted", {
      authTicket,
    });
    return Promise.resolve();
  }
}
