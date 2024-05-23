import type { AuthenticationCode } from '@dashlane/communication';
import { TwoFactorAuthenticationError } from '@dashlane/hermes';
export interface TwoFactorAuthenticationErrorLog {
    logErrorName: TwoFactorAuthenticationError;
    errorMessage: string;
}
export interface TwoFactorAuthenticationErrorWithMessage {
    code: string | AuthenticationCode;
    message: string;
}
