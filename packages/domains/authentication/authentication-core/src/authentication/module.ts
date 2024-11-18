import { Module } from "@dashlane/framework-application";
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
})
export class AuthenticationModule {}
