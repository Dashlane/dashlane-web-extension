import { firstValueFrom } from "rxjs";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { carbonLegacyApi, CarbonLegacyClient } from "@dashlane/communication";
import {
  AllowedToFail,
  deviceScopedSingletonProvider,
  Module,
  useEventsOfModule,
} from "@dashlane/framework-application";
import {
  ApplicationBuildType,
  PlatformInfoClient,
} from "@dashlane/framework-contracts";
import { isSuccess } from "@dashlane/framework-types";
import {
  PlatformInfoModule,
  WebServicesModule,
} from "@dashlane/framework-dashlane-application";
import {
  AuthenticationFlowMachineStore,
  SsoProviderInfoStore,
  SsoUserSettingsStore,
} from "./stores/";
import {
  CancelDeviceTransferRequestCommandHandler,
  ChangeAccountEmailCommandHandler,
  ChangeTwoFactorAuthenticationOtpTypeCommandHandler,
  ClearErrorCommandHandler,
  InitiateAutologinWithSSOCommandHandler,
  InitiateLoginWithSSOCommandHandler,
  LockCommandHandler,
  LoginViaSSOCommandHandler,
  LogoutCommandHandler,
  ResendEmailTokenCommandHandler,
  ResendPushNotificationCommandHandler,
  RetryWebAuthnAuthenticationCommandHandler,
  SendAccountEmailCommandHandler,
  SendMasterPasswordCommandHandler,
  SubmitBackupCodeCommandHandler,
  SubmitEmailTokenCommandHandler,
  SubmitTotpCommandHandler,
  SwitchToDashlaneAuthenticatorCommandHandler,
  SwitchToDevicetoDeviceAuthenticationCommandHandler,
  SwitchToEmailTokenCommandHandler,
  WebAuthnAuthenticationFailCommandHandler,
} from "./handlers/commands";
import { CarbonLegacyEventHandler } from "./handlers/events";
import {
  AuthenticationFlowQueryStatusHandler,
  SsoProviderInfoQueryStatusHandler,
  SsoUserSettingsQueryStatusHandler,
} from "./handlers/queries";
import { AuthenticationFlowInfraContext } from "./configurations";
import { DeviceRegistrationFlowMachineStore } from "./flows/device-registration-flow/stores/device-registration-flow-machine.store";
import { AuthenticationMachine } from "./flows/main-flow/authentication.machine";
import { InitializeMachineService } from "./flows/main-flow/initialize.service";
import { LegacySSOLoginService } from "./flows/main-flow/sso.service";
import { AccountRecoveryStatusService } from "./flows/master-password-flow/services/account-recovery-status.service";
import { DashlaneAuthenticatorService } from "./flows/device-registration-flow/dashlane-authenticator/dashlane-authenticator.service";
import { MasterPasswordService } from "./flows/master-password-flow/services/master-password.service";
import { TwoFactorAuthenticationService } from "./flows/two-factor-authentication-flow/two-factor-authentication.service";
import { CheckAccountTypeService } from "./flows/main-flow/check-account-type.service";
import { DashlaneAuthenticatorMachine } from "./flows/device-registration-flow/dashlane-authenticator/dashlane-authenticator.machine";
import { DeviceRegistrationMachine } from "./flows/device-registration-flow/device-registration.machine";
import { EmailTokenMachine } from "./flows/device-registration-flow/email-token/email.token.machine";
import { WebAuthnFlowMachine } from "./flows/webauthn-flow/webauthn.machine";
import { MasterPasswordFlowMachine } from "./flows/master-password-flow/master-password.machine";
import { TwoFactorAuthenticationMachine } from "./flows/two-factor-authentication-flow/two-factor-authentication.machine";
import {
  AuthenticateWithEmailToken,
  SendEmailToken,
} from "./flows/device-registration-flow/email-token/services";
import { CheckIsMigrationNeededService } from "./flows/master-password-flow/services/check-is-migration-needed.service";
import { AuthenticationFlow } from "./services/authentication-flow.instance.service";
import { StoreSSOInfoService } from "./flows/main-flow/store-sso-info.service";
import { DeviceToDeviceAuthenticationFlowMachine } from "./flows/device-to-device-authentication-flow";
import { RequestDeviceTransferService } from "./flows/device-to-device-authentication-flow/services/request-device-transfer.service";
import { DeviceTransferModule } from "../device-transfer";
import { MasterPasswordVerificationService } from "./flows/master-password-flow/services/master-password-verification.service";
import { StartReceiverKeyExchangeService } from "./flows/device-to-device-authentication-flow/services/start-receiver-key-exchange.service";
import { CompleteKeyExchangeAndGeneratePassphraseService } from "./flows/device-to-device-authentication-flow/services/complete-key-exchange-and-generate-pasphrase.service";
import { StartTransferService } from "./flows/device-to-device-authentication-flow/services/start-transfer.service";
import { OpenSessionService } from "./flows/device-to-device-authentication-flow/services/open-session.service";
import { DeviceToDeviceCryptoService } from "../device-transfer/services/device-to-device-crypto.service";
import { DeviceToDeviceAuthenticationService } from "../device-transfer/services/device-to-device-authentication.service";
import {
  PassphraseService,
  WordlistFetcher,
} from "../device-transfer/services/passphrase.service";
import { SubmitPinCodeCommandHandler } from "./handlers/commands/submit-pin-code.command-handler";
import { PinCodeMachine } from "./flows/pin-code-flow/pin-code.machine";
import { PinCodeVerificationService } from "./flows/pin-code-flow/pin-code-verification.service";
import { CheckPinCodeStatusService } from "./flows/main-flow/check-pin-code-status.service";
import { SwitchToMasterPasswordCommandHandler } from "./handlers/commands/switch-to-master-password.command-handler";
import { SwitchToPinCodeCommandHandler } from "./handlers/commands/switch-to-pin-code.command-handler";
@Module({
  api: AuthenticationFlowContracts.authenticationFlowApi,
  handlers: {
    commands: {
      changeLogin: ChangeAccountEmailCommandHandler,
      changeTwoFactorAuthenticationOtpType:
        ChangeTwoFactorAuthenticationOtpTypeCommandHandler,
      clearError: ClearErrorCommandHandler,
      cancelDeviceTransferRequest: CancelDeviceTransferRequestCommandHandler,
      resendEmailToken: ResendEmailTokenCommandHandler,
      resendPushNotification: ResendPushNotificationCommandHandler,
      sendAccountEmail: SendAccountEmailCommandHandler,
      sendMasterPassword: SendMasterPasswordCommandHandler,
      submitBackupCode: SubmitBackupCodeCommandHandler,
      submitEmailToken: SubmitEmailTokenCommandHandler,
      submitTotp: SubmitTotpCommandHandler,
      submitPinCode: SubmitPinCodeCommandHandler,
      switchToMasterPassword: SwitchToMasterPasswordCommandHandler,
      switchToDashlaneAuthenticator:
        SwitchToDashlaneAuthenticatorCommandHandler,
      switchToEmailToken: SwitchToEmailTokenCommandHandler,
      switchToDevicetoDeviceAuthentication:
        SwitchToDevicetoDeviceAuthenticationCommandHandler,
      switchToPinCode: SwitchToPinCodeCommandHandler,
      retryWebAuthnAuthentication: RetryWebAuthnAuthenticationCommandHandler,
      webAuthnAuthenticationFail: WebAuthnAuthenticationFailCommandHandler,
      logout: LogoutCommandHandler,
      lockSession: LockCommandHandler,
      loginViaSSO: LoginViaSSOCommandHandler,
      initiateLoginWithSSO: InitiateLoginWithSSOCommandHandler,
      initiateAutologinWithSSO: InitiateAutologinWithSSOCommandHandler,
    },
    events: {
      ...useEventsOfModule(carbonLegacyApi, {
        carbonLegacy: CarbonLegacyEventHandler,
      }),
    },
    queries: {
      authenticationFlowStatus: AuthenticationFlowQueryStatusHandler,
      getSsoUserSettings: SsoUserSettingsQueryStatusHandler,
      getProviderInfo: SsoProviderInfoQueryStatusHandler,
    },
  },
  configurations: {
    authenticationFlowContextInfrastructure: {
      token: AuthenticationFlowInfraContext,
    },
  },
  providers: [
    DashlaneAuthenticatorMachine,
    DeviceRegistrationMachine,
    EmailTokenMachine,
    WebAuthnFlowMachine,
    MasterPasswordFlowMachine,
    TwoFactorAuthenticationMachine,
    DeviceToDeviceAuthenticationFlowMachine,
    ...deviceScopedSingletonProvider(AuthenticationFlow, {
      inject: [
        AuthenticationMachine,
        AuthenticationFlowMachineStore,
        CarbonLegacyClient,
        PlatformInfoClient,
        AllowedToFail,
      ],
      asyncFactory: async (
        authenticationFlowMachine: AuthenticationMachine,
        loginMachineStore: AuthenticationFlowMachineStore,
        carbon: CarbonLegacyClient,
        platformInfoClient: PlatformInfoClient,
        allowToFail: AllowedToFail
      ) => {
        let withDebugLogs = false;
        const platformInfo = await firstValueFrom(
          platformInfoClient.queries.platformInfo()
        );
        if (
          isSuccess(platformInfo) &&
          (platformInfo.data.buildType === ApplicationBuildType.DEV ||
            platformInfo.data.buildType === ApplicationBuildType.NIGHTLY)
        ) {
          withDebugLogs = true;
        }
        const flow = new AuthenticationFlow(
          authenticationFlowMachine,
          loginMachineStore,
          withDebugLogs,
          carbon,
          allowToFail
        );
        await flow.prepare();
        return flow;
      },
    }),
    AuthenticationMachine,
    PinCodeMachine,
    PinCodeVerificationService,
    InitializeMachineService,
    LegacySSOLoginService,
    AccountRecoveryStatusService,
    CheckIsMigrationNeededService,
    DashlaneAuthenticatorService,
    AuthenticateWithEmailToken,
    MasterPasswordService,
    TwoFactorAuthenticationService,
    CheckAccountTypeService,
    SendEmailToken,
    StoreSSOInfoService,
    CheckPinCodeStatusService,
    RequestDeviceTransferService,
    MasterPasswordVerificationService,
    StartReceiverKeyExchangeService,
    CompleteKeyExchangeAndGeneratePassphraseService,
    StartTransferService,
    OpenSessionService,
    DeviceToDeviceCryptoService,
    DeviceToDeviceAuthenticationService,
    PassphraseService,
    WordlistFetcher,
  ],
  stores: [
    AuthenticationFlowMachineStore,
    DeviceRegistrationFlowMachineStore,
    SsoUserSettingsStore,
    SsoProviderInfoStore,
  ],
  imports: [WebServicesModule, PlatformInfoModule, DeviceTransferModule],
})
export class AuthenticationFlowModule {}
