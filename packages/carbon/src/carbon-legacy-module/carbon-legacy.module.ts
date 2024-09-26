import {
  carbonCommandsSlots,
  carbonLegacyApi,
  carbonLiveQueriesSlots,
  carbonQueriesSlots,
} from "@dashlane/communication";
import { Module, useEventsOfModule } from "@dashlane/framework-application";
import { CarbonCommandHandler } from "./handlers/carbon-command-handler";
import { CarbonLegacyLeelooCommandHandler } from "./handlers/carbon-extension-command-handler";
import { CarbonEventEmitter } from "./carbon-events-emitter";
import { CarbonLegacyInfrastructure } from "./carbon-legacy-infrastructure";
import { CarbonLegacyBootstrap } from "./carbon-legacy-module-init";
import { CarbonGetStateQueryHandler } from "./handlers/carbon-legacy-query-handler";
import { CarbonStateListQueryHandler } from "./handlers/carbon-state-list.handler";
import { DeleteGrapheneUserDataCommandHandler } from "./handlers/delete-graphene-user-data-command-handler";
import { createHandlersConfigForCarbonApiQueries } from "./handlers/carbon-api-queries-handler";
import {
  CarbonApiCommandsHandler,
  createHandlersConfigForConnectorCommands,
} from "./handlers/carbon-api-commands-handler";
import { sessionApi } from "@dashlane/session-contracts";
import { SessionOpenedEventHandler } from "./handlers/session-opened-event-handler";
@Module({
  api: carbonLegacyApi,
  handlers: {
    commands: {
      carbon: CarbonCommandHandler,
      carbonLegacyLeeloo: CarbonLegacyLeelooCommandHandler,
      mitigationDeleteGrapheneUserData: DeleteGrapheneUserDataCommandHandler,
      ...createHandlersConfigForConnectorCommands(
        carbonCommandsSlots,
        CarbonApiCommandsHandler
      ),
    },
    events: {
      ...useEventsOfModule(sessionApi, {
        sessionOpened: SessionOpenedEventHandler,
      }),
    },
    queries: {
      carbonState: CarbonGetStateQueryHandler,
      carbonStateList: CarbonStateListQueryHandler,
      ...createHandlersConfigForCarbonApiQueries(
        carbonQueriesSlots,
        carbonLiveQueriesSlots
      ),
    },
  },
  configurations: {
    infrastructure: {
      token: CarbonLegacyInfrastructure,
    },
  },
  onFrameworkInit: CarbonLegacyBootstrap,
  providers: [CarbonEventEmitter],
  requiredFeatureFlips: [
    "audit_logs_vault",
    "autofill_web_linkedWebsites",
    "autofill_web_linkedWebsites_dev",
    "breachesFetchWeb",
    "masterPasswordLeakCheckLog",
    "ptu_web_MPprotect_phase3",
    "SAEXAccountRecoveryv3",
    "sharing_web_invalidSignatureAutoRevoke_prod",
  ],
})
export class CarbonLegacyModule {}
