import { All, Controller, Req, Scope } from "@nestjs/common";
import { Observable } from "rxjs";
import {
  type ApplicationRequest,
  PipelineType,
} from "./nest-request-response-bus";
import {
  AnyModuleApi,
  CommandMessage,
  CommandSuccess,
  EventMessage,
  NullModuleApi,
  QueryMessage,
  UseCaseScope,
} from "@dashlane/framework-contracts";
import { ContextIdFactory, ModuleRef } from "@nestjs/core";
import { ICommandHandler, IEventHandler, IQueryHandler } from "../../cqrs";
import {
  AnyFunctionalError,
  assertUnreachable,
  Result,
} from "@dashlane/framework-types";
import { FrameworkRequestContextValues } from "../../request-context/request-context";
import {
  NodeModulesIntrospection,
  NullHandlers,
} from "../../dependency-injection/module.types";
import { ICronTaskHandler } from "../../tasks";
@Controller({ scope: Scope.REQUEST, durable: false })
export class BaseNestController {
  constructor(
    private introspection: NodeModulesIntrospection,
    private moduleRef: ModuleRef
  ) {}
  @All()
  async execute(
    @Req()
    request: ApplicationRequest
  ): Promise<unknown> {
    const contextId = ContextIdFactory.getByRequest(request);
    const { type } = request;
    if (!(request.module in this.introspection.modules)) {
      throw new Error("Unknown module " + request.module);
    }
    const module = this.introspection.modules[request.module];
    const api: AnyModuleApi = module.api ?? NullModuleApi;
    const apiHandlers = module.handlers ?? NullHandlers;
    switch (type) {
      case PipelineType.Query: {
        const { queries } = api;
        if (request.name in queries) {
          const queryClass = queries[request.name];
          const query = new queryClass(request.body);
          const handlerType = apiHandlers.queries[request.name];
          const handler = await this.moduleRef.resolve<
            IQueryHandler<QueryMessage<unknown, unknown, AnyFunctionalError>>
          >(handlerType, contextId, { strict: false });
          const result = handler.execute(query, {
            name: request.name,
          }) as Observable<Result<unknown, unknown>>;
          return { result };
        }
        throw new Error("Unknown query " + request.name);
      }
      case PipelineType.Command: {
        const { commands } = api;
        if (request.name in commands) {
          const commandClass = commands[request.name];
          const command = new commandClass(request.body);
          const handlerType = apiHandlers.commands[request.name];
          const handler = await this.moduleRef.resolve<
            ICommandHandler<
              CommandMessage<unknown, CommandSuccess, AnyFunctionalError>
            >
          >(handlerType, contextId, { strict: false });
          const result = (await handler.execute(command, {
            name: request.name,
          })) as Result<unknown, unknown>;
          return { result };
        }
        throw new Error("Unknown command " + request.name);
      }
      case PipelineType.Event: {
        const { events } = api;
        if (request.name in events) {
          const eventClass = events[request.name];
          const event = new eventClass(request.body);
          const handlerTypes = Object.values(
            this.introspection.modules
          ).flatMap(
            (m) =>
              (m.handlers ?? NullHandlers).events[request.module]?.events[
                request.name
              ]
          );
          const handlers = await Promise.all(
            handlerTypes
              .filter((x) => this.introspection.supportedEventHandlers.has(x))
              .map(
                async (handlerType) =>
                  await this.moduleRef.resolve<
                    IEventHandler<EventMessage<unknown>>
                  >(handlerType, contextId, {
                    strict: false,
                  })
              )
          );
          await Promise.all(handlers.map((handler) => handler.handle(event)));
          return;
        }
        throw new Error("Unknown event " + request.name);
      }
      case PipelineType.Cron: {
        const cron = (module.crons ?? []).find((c) => c.name === request.name);
        if (!cron) {
          throw new Error("unknown cron " + request.name);
        }
        if (cron.scope === UseCaseScope.User) {
          const user = request.context.getOrFail<string>(
            FrameworkRequestContextValues.UserName,
            {
              errorMessage: `Expected ${FrameworkRequestContextValues.UserName} to be set in the request context`,
            }
          );
          if (!user) {
            return { result: false };
          }
        }
        const handler = await this.moduleRef.resolve<ICronTaskHandler>(
          cron.handler,
          contextId,
          { strict: false }
        );
        if (handler.isRunnable) {
          if (!(await handler.isRunnable())) {
            return { result: false };
          }
        }
        await handler.run();
        return { result: true };
      }
    }
    return assertUnreachable(type);
  }
}
