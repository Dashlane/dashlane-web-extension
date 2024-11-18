import {
  ActiveUserHandler,
  SetActiveUserHandler,
} from "./request-context.handlers";
import { ActiveUserStore } from "./request-context.store";
import { Module } from "../../dependency-injection/module.decorators";
import { RequestContextEventsEmitter } from "./events-emitter";
import { requestContextApi } from "@dashlane/framework-contracts";
import { createLoggerProvider } from "../../logging";
import { RequestContextLogger } from "./request-context-logger";
@Module({
  api: requestContextApi,
  handlers: {
    commands: {
      setActiveUser: SetActiveUserHandler,
    },
    events: {},
    queries: {
      activeUser: ActiveUserHandler,
    },
  },
  stores: [ActiveUserStore],
  providers: [
    RequestContextEventsEmitter,
    createLoggerProvider(RequestContextLogger),
  ],
  domainName: "framework",
})
export class RequestContextModule {}
