import { IdentityVerificationFlowContracts } from "@dashlane/authentication-contracts";
import { Injectable } from "@dashlane/framework-application";
import { isFailure } from "@dashlane/framework-types";
import { IdentityVerificationEventsEmitter } from "../../handlers/events";
import { IdentityVerificationService } from "../../services/identity-verification.service";
import {
  DefaultErrorCode,
  FunctionalErrorName,
  PerformTotpVerificationError,
  TotpErrorCode,
} from "../../types/errors";
import { DASHLANE_OTP_REGEX } from "../../utils/constants";
interface Params {
  login: string;
  masterPassword: string | null;
  otp?: string;
  twoFactorAuthenticationOtpType?: IdentityVerificationFlowContracts.IdentityVerificationFlowTwoFactorAuthenticationOtpType;
  persistData: boolean;
  otpVerificationMode?: string;
  deviceName?: string;
}
@Injectable()
export class TwoFactorAuthenticationService {
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
    error: PerformTotpVerificationError
  ): TotpErrorCode | DefaultErrorCode {
    switch (error.tag) {
      case FunctionalErrorName.VERIFICATION_FAILED:
        return TotpErrorCode.OTP_NOT_VALID;
      case FunctionalErrorName.INVALID_OTP_ALREADY_USED:
        return TotpErrorCode.OTP_ALREADY_USED;
      case FunctionalErrorName.INVALID_OTP_BLOCKED:
        return TotpErrorCode.OTP_TOO_MANY_ATTEMPTS;
      default:
        return DefaultErrorCode.UNKNOWN_ERROR;
    }
  }
  public async executeWithParams(context: Params) {
    if (
      !context.login ||
      !context.otp ||
      context.otp.length === 0 ||
      (context.twoFactorAuthenticationOtpType === "totp" &&
        !DASHLANE_OTP_REGEX.test(context.otp))
    ) {
      return Promise.reject(DefaultErrorCode.UNKNOWN_ERROR);
    }
    const result =
      await this.identityVerificationService.performTotpVerification(
        context.login,
        context.otp
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
