import { TwoFactorAuthenticationInfoError, TwoFactorAuthenticationInfoPending, TwoFactorAuthenticationInfoReady, TwoFactorAuthenticationInfoRequestStatus, TwoFactorAuthenticationInfoUnknown, TwoFactorAuthenticationType, } from '@dashlane/communication';
export const MockTwoFactorAuthenticationInfoReady: TwoFactorAuthenticationInfoReady = {
    status: TwoFactorAuthenticationInfoRequestStatus.READY,
    type: TwoFactorAuthenticationType.EMAIL_TOKEN,
    isTwoFactorAuthenticationEnabled: false,
    isTwoFactorAuthenticationEnforced: true,
    shouldEnforceTwoFactorAuthentication: false,
    lastUpdateDateUnix: 1625216767,
    recoveryPhone: '+33012345678',
    isDuoEnabled: false,
    hasU2FKeys: false,
    ssoInfo: {
        serviceProviderUrl: '*****',
        migration: 'sso_member_to_admin',
    },
};
export const MockTwoFactorAuthenticationInfoInitial: TwoFactorAuthenticationInfoUnknown = {
    status: TwoFactorAuthenticationInfoRequestStatus.UNKNOWN,
};
export const MockTwoFactorAuthenticationInfoPending: TwoFactorAuthenticationInfoPending = {
    status: TwoFactorAuthenticationInfoRequestStatus.PENDING,
};
export const MockTwoFactorAuthenticationInfoError: TwoFactorAuthenticationInfoError = {
    status: TwoFactorAuthenticationInfoRequestStatus.ERROR,
};
export const MockTwoFactorAuthenticationInfoDeviceRegistration: TwoFactorAuthenticationInfoReady = {
    ...MockTwoFactorAuthenticationInfoReady,
    isTwoFactorAuthenticationEnabled: true,
    type: TwoFactorAuthenticationType.DEVICE_REGISTRATION,
};
