import { Module } from "@dashlane/framework-application";
import { AuthenticationWebServicesRepository } from "./authentication-ws-credentials.repository";
import { authenticationApi } from "@dashlane/authentication-contracts";
import { CanLockAppQueryHandler } from "./queries/can-lock-app-query-handler";
@Module({
  api: authenticationApi,
  handlers: {
    commands: {},
    events: {},
    queries: {
      canLockApp: CanLockAppQueryHandler,
    },
  },
  providers: [AuthenticationWebServicesRepository],
  exports: [AuthenticationWebServicesRepository],
})
export class AuthenticationModule {}
