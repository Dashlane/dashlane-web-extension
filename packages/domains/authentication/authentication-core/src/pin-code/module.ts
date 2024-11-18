import { Module } from "@dashlane/framework-application";
import { pinCodeApi } from "@dashlane/authentication-contracts";
import {
  CryptographyModule,
  WebServicesModule,
} from "@dashlane/framework-dashlane-application";
import {
  ActivateCommandHandler,
  DeactivateCommandHandler,
  LoginWithPinCodeCommandHandler,
} from "./handlers/commands";
import { GetStatusQueryHandler } from "./handlers/queries/get-status.query-handler";
import { PinCodeService } from "./services/pin-code.service";
import { PinCodeStore } from "./stores/pin-code.store";
import { SessionKeyCrypto } from "./services/session-key-crypto.service";
import {
  GetCurrentUserStatusQueryHandler,
  IsPinCodeCorrectQueryHandler,
} from "./handlers/queries";
import { PinCodeServerConfigResourceLoader } from "./services/pin-code-server-configs.resource-loader";
@Module({
  api: pinCodeApi,
  stores: [PinCodeStore],
  imports: [CryptographyModule, WebServicesModule],
  handlers: {
    commands: {
      activate: ActivateCommandHandler,
      deactivate: DeactivateCommandHandler,
      loginWithPinCode: LoginWithPinCodeCommandHandler,
    },
    events: {},
    queries: {
      isPinCodeCorrect: IsPinCodeCorrectQueryHandler,
      getStatus: GetStatusQueryHandler,
      getCurrentUserStatus: GetCurrentUserStatusQueryHandler,
    },
  },
  providers: [
    PinCodeService,
    SessionKeyCrypto,
    PinCodeServerConfigResourceLoader,
  ],
})
export class PinCodeModule {}
