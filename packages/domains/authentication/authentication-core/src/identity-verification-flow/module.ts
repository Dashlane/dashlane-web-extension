import {
  deviceScopedSingletonProvider,
  Module,
} from "@dashlane/framework-application";
import { WebServicesModule } from "@dashlane/framework-dashlane-application";
import { IdentityVerificationFlowContracts } from "@dashlane/authentication-contracts";
import { DeviceRegistrationMachine } from "./flows/device-registration-flow/device-registration.machine";
import { EmailTokenMachine } from "./flows/device-registration-flow/email-token/email-token.machine";
import {
  AuthenticateWithEmailToken,
  SendEmailToken,
} from "./flows/device-registration-flow/email-token/services";
import { DeviceRegistrationFlowMachineStore } from "./flows/device-registration-flow/stores/device-registration-flow-machine.store";
import { IdentityVerificationMachine } from "./flows/main-flow/identity-verification.machine";
import { TwoFactorAuthenticationMachine } from "./flows/two-factor-authentication-flow/two-factor-authentication.machine";
import { TwoFactorAuthenticationService } from "./flows/two-factor-authentication-flow/two-factor-authentication.service";
import { IdentityVerificationFlowQueryStatusHandler } from "./handlers/queries";
import {
  CancelIdentityVerificationCommandHandler,
  ChangeTwoFactorAuthenticationOtpTypeCommandHandler,
  ClearIdentityVerificationErrorCommandHandler,
  ResendEmailTokenCommandHandler,
  ResendPushNotificationCommandHandler,
  StartIdentityVerificationCommandHandler,
  SubmitBackupCodeCommandHandler,
  SubmitEmailTokenCommandHandler,
  SubmitTotpCommandHandler,
  SwitchToDashlaneAuthenticatorCommandHandler,
  SwitchToEmailTokenCommandHandler,
} from "./handlers/commands";
import { IdentityVerificationEventsEmitter } from "./handlers/events";
import { IdentityVerificationFlowMachineStore } from "./stores";
import { DashlaneAuthenticatorMachine } from "./flows/device-registration-flow/dashlane-authenticator/dashlane-authenticator.machine";
import { DashlaneAuthenticatorService } from "./flows/device-registration-flow/dashlane-authenticator/dashlane-authenticator.service";
import { IdentityVerificationFlow } from "./services/identity-verification-flow.instance.service";
import { IdentityVerificationService } from "./services/identity-verification.service";
@Module({
  api: IdentityVerificationFlowContracts.identityVerificationFlowApi,
  handlers: {
    commands: {
      changeTwoFactorAuthenticationOtpType:
        ChangeTwoFactorAuthenticationOtpTypeCommandHandler,
      clearError: ClearIdentityVerificationErrorCommandHandler,
      resendEmailToken: ResendEmailTokenCommandHandler,
      resendPushNotification: ResendPushNotificationCommandHandler,
      submitBackupCode: SubmitBackupCodeCommandHandler,
      submitEmailToken: SubmitEmailTokenCommandHandler,
      submitTotp: SubmitTotpCommandHandler,
      switchToDashlaneAuthenticator:
        SwitchToDashlaneAuthenticatorCommandHandler,
      switchToEmailToken: SwitchToEmailTokenCommandHandler,
      startIdentityVerification: StartIdentityVerificationCommandHandler,
      cancelIdentityVerification: CancelIdentityVerificationCommandHandler,
    },
    events: {},
    queries: {
      identityVerificationFlowStatus:
        IdentityVerificationFlowQueryStatusHandler,
    },
  },
  providers: [
    DeviceRegistrationMachine,
    DashlaneAuthenticatorMachine,
    DashlaneAuthenticatorService,
    EmailTokenMachine,
    TwoFactorAuthenticationMachine,
    ...deviceScopedSingletonProvider(IdentityVerificationFlow, {
      inject: [
        IdentityVerificationMachine,
        IdentityVerificationFlowMachineStore,
      ],
      asyncFactory: async (
        identityVerificationMachine: IdentityVerificationMachine,
        identityVerificationMachineStore: IdentityVerificationFlowMachineStore
      ) => {
        const flow = new IdentityVerificationFlow(
          identityVerificationMachine,
          identityVerificationMachineStore
        );
        await flow.prepare();
        return flow;
      },
    }),
    IdentityVerificationMachine,
    AuthenticateWithEmailToken,
    TwoFactorAuthenticationService,
    SendEmailToken,
    IdentityVerificationService,
    IdentityVerificationEventsEmitter,
  ],
  imports: [WebServicesModule],
  exports: [IdentityVerificationFlow],
  stores: [
    IdentityVerificationFlowMachineStore,
    DeviceRegistrationFlowMachineStore,
  ],
})
export class IdentityVerificationFlowModule {}
