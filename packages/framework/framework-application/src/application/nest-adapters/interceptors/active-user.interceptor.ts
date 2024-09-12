import {
  BehaviorSubject,
  firstValueFrom,
  from,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from "rxjs";
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import {
  AnyFunctionalError,
  assertUnreachable,
  failure,
  getSuccess,
  isSuccess,
} from "@dashlane/framework-types";
import {
  AnyModuleApi,
  requestContextApi,
  UseCaseMetadata,
  UseCaseScope,
} from "@dashlane/framework-contracts";
import {
  ApplicationCronData,
  ApplicationRequest,
  ApplicationRequestCommand,
  ApplicationRequestEvent,
  ApplicationRequestQuery,
  PipelineType,
} from "../nest-request-response-bus";
import { ContextLessCqrsClient } from "../../../client/cqrs-client.service";
import { NodeConfiguration } from "../../../messaging/node-configuration";
import {
  FrameworkRequestContextValues,
  RequestContext,
} from "../../../request-context/request-context";
import { NodeModulesIntrospection } from "../../../dependency-injection/module.types";
const CronNoError: AnyFunctionalError = { tag: "" };
@Injectable()
export class ActiveUserInterceptor implements NestInterceptor {
  public constructor(
    private clients: ContextLessCqrsClient,
    private config: NodeConfiguration,
    private introspection: NodeModulesIntrospection
  ) {}
  public intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<unknown> {
    const request = context.switchToHttp().getRequest() as ApplicationRequest;
    const { appDefinition } = this.config;
    if (request.type === PipelineType.Cron) {
      return this.checkCronActiveUser(next, request);
    }
    if (!(request.module in appDefinition)) {
      return next.handle();
    }
    const moduleApi = appDefinition[request.module].api;
    switch (request.type) {
      case PipelineType.Query:
        return this.checkQueryActiveUser(next, request, moduleApi);
      case PipelineType.Command:
        return this.checkCommandActiveUser(next, request, moduleApi);
      case PipelineType.Event:
        return this.checkEventActiveUser(next, request, moduleApi);
      default:
        assertUnreachable(request);
    }
  }
  private checkCronActiveUser(
    next: CallHandler,
    request: ApplicationCronData
  ): Observable<unknown> {
    const module = this.introspection.modules[request.module];
    const cron = (module.crons ?? []).find((c) => c.name === request.name);
    if (!cron) {
      throw new Error("No such cron " + request.name);
    }
    if (cron.scope === UseCaseScope.Device) {
      return next.handle();
    }
    return this.checkActiveUserPromise(
      next,
      request.context,
      { noUserError: CronNoError, scope: UseCaseScope.User },
      `Cron`
    );
  }
  private checkQueryActiveUser(
    next: CallHandler,
    request: ApplicationRequestQuery,
    moduleApi: AnyModuleApi
  ): Observable<unknown> {
    const { queries } = moduleApi;
    if (request.name in queries) {
      const queryClass = queries[request.name];
      const { metadata } = queryClass;
      return this.checkActiveUserObservable(
        next,
        request.context,
        metadata,
        `Query ${request.module}.${request.name}`
      );
    }
    return next.handle();
  }
  private checkCommandActiveUser(
    next: CallHandler,
    request: ApplicationRequestCommand,
    moduleApi: AnyModuleApi
  ): Observable<unknown> {
    const { commands } = moduleApi;
    if (request.name in commands) {
      const commandClass = commands[request.name];
      const { metadata } = commandClass;
      return this.checkActiveUserPromise(
        next,
        request.context,
        metadata,
        `Command ${request.module}.${request.name}`
      );
    }
    return next.handle();
  }
  private checkEventActiveUser(
    next: CallHandler,
    request: ApplicationRequestEvent,
    moduleApi: AnyModuleApi
  ): Observable<unknown> {
    const { events } = moduleApi;
    if (request.name in events) {
      const eventClass = events[request.name];
      const { metadata } = eventClass;
      return this.checkActiveUserPromise(
        next,
        request.context,
        metadata,
        `Event ${request.module}.${request.name}`
      );
    }
    return next.handle();
  }
  private checkActiveUserPromise(
    next: CallHandler,
    requestContext: RequestContext,
    metadata: UseCaseMetadata,
    errorMessage: string
  ) {
    if (metadata.scope !== UseCaseScope.User) {
      return next.handle();
    }
    const { noUserError } = metadata;
    return from(
      requestContext.getOrAdd(FrameworkRequestContextValues.UserName, () =>
        this.queryUserName()
      )
    ).pipe(
      switchMap((activeUserName) => {
        if (activeUserName) {
          return next.handle();
        }
        if (noUserError) {
          return of({ result: failure(noUserError) });
        }
        throw new Error(`Not logged in : ${errorMessage}`);
      })
    );
  }
  private checkActiveUserObservable(
    next: CallHandler,
    requestContext: RequestContext,
    metadata: UseCaseMetadata,
    errorMessage: string
  ) {
    if (metadata.scope !== UseCaseScope.User) {
      return next.handle();
    }
    const { noUserError } = metadata;
    return of({
      result: noUserError
        ? this.createResultObservable(
            next,
            requestContext,
            () => new BehaviorSubject(failure(noUserError))
          )
        : this.createResultObservable(next, requestContext, () =>
            throwError(() => new Error(`Not logged in : ${errorMessage}`))
          ),
    });
  }
  private createResultObservable(
    next: CallHandler,
    requestContext: RequestContext,
    onNoUser: () => Observable<unknown>
  ) {
    return this.queryUserName$().pipe(
      tap((activeUserName) => {
        requestContext.set(
          FrameworkRequestContextValues.UserName,
          activeUserName
        );
      }),
      switchMap((activeUserName) =>
        activeUserName
          ? next.handle().pipe(switchMap(({ result }) => result))
          : onNoUser()
      )
    );
  }
  private queryUserName$(): Observable<string | undefined> {
    return this.clients
      .getClient(requestContextApi)
      .queries.activeUser()
      .pipe(
        map((userNameQuery) => {
          if (
            !isSuccess(userNameQuery) ||
            !getSuccess(userNameQuery).userName
          ) {
            return undefined;
          }
          return userNameQuery.data.userName;
        })
      );
  }
  private queryUserName(): Promise<string | undefined> {
    return firstValueFrom(this.queryUserName$());
  }
}
