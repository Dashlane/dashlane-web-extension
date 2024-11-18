import { ContextIdFactory } from "@nestjs/core/helpers/context-id-factory.js";
import { REQUEST_CONTEXT_ID } from "@nestjs/core/router/request/request-constants.js";
import {
  AnyModuleApis,
  ApplicationDefinition,
  NodeIdentifiersOf,
} from "@dashlane/framework-contracts";
import { assertUnreachable, Result, success } from "@dashlane/framework-types";
import { HttpServer } from "@nestjs/common";
import {
  type INestApplication,
  RequestHandler,
} from "@nestjs/common/interfaces";
import { BehaviorSubject, EMPTY, from, mergeAll, Observable } from "rxjs";
import { CqrsBroker, NodeEventBroker } from "../../client";
import { CqrsCallbacks } from "../../client/cqrs-broker";
import { LocalEventCallback } from "../../client/node-event-broker";
import {
  ApplicationCronData,
  ApplicationPipelineData,
  ApplicationRequest,
  ApplicationRequestCommand,
  ApplicationRequestEvent,
  ApplicationRequestQuery,
  ApplicationResponse,
  CommandPipelineResult,
  CronPipelineResult,
  PipelineType,
  QueryPipelineResult,
} from "./nest-request-response-bus";
import {
  FrameworkRequestContextValues,
  RequestContext,
} from "../../request-context";
import { CronsBroker } from "../../tasks/crons-broker";
const MockedNestFunction = () => {};
const NotSupportedNestFunction = (): never => {
  throw new Error("Not supported");
};
export class ApplicationNodeHttpServer<
  TAppDefinition extends ApplicationDefinition<string, AnyModuleApis>,
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition>
> implements HttpServer<ApplicationPipelineData, ApplicationResponse>
{
  constructor(
    private cqrsBroker: CqrsBroker<TAppDefinition, TCurrentNode>,
    private eventsBroker: NodeEventBroker<TAppDefinition, TCurrentNode>,
    private cronsBroker: CronsBroker
  ) {}
  public readonly isListening$ = new BehaviorSubject(false);
  private cqrsCallbacks?: CqrsCallbacks<TAppDefinition>;
  private eventCallbacks?: LocalEventCallback<TAppDefinition>;
  private cronCallbacks?: (
    module: string,
    cronName: string
  ) => Promise<boolean>;
  private app: INestApplication | undefined;
  public isHeadersSent(): boolean {
    return false;
  }
  public setAppInstance(app: INestApplication) {
    this.app = app;
  }
  private bindHandler(
    handler: RequestHandler<ApplicationPipelineData, ApplicationResponse>
  ): void {
    if (this.cqrsCallbacks || this.eventCallbacks) {
      throw new Error("Handler already registered");
    }
    this.cqrsCallbacks = {
      onCommand: (module, commandName, body, context) => {
        return new Promise<Result<unknown, unknown>>((resolve, reject) => {
          const request = this.initRequest<ApplicationRequestCommand>({
            type: PipelineType.Command,
            module,
            name: commandName,
            body,
            context,
          });
          const response: ApplicationResponse = {
            type: PipelineType.Command,
            value: { result: success(undefined) },
            reply: resolve,
            fail: reject,
          };
          handler(request, response);
        });
      },
      onQuery: (module, queryName, body, context) => {
        const observablePromise = new Promise<
          Observable<Result<unknown, unknown>>
        >((resolve, reject) => {
          const request = this.initRequest<ApplicationRequestQuery>({
            type: PipelineType.Query,
            module,
            name: queryName,
            body,
            context,
          });
          const response: ApplicationResponse = {
            type: PipelineType.Query,
            value: { result: EMPTY },
            reply: resolve,
            fail: reject,
          };
          handler(request, response);
        });
        return from(observablePromise).pipe(mergeAll());
      },
    };
    this.eventCallbacks = {
      onLocalEvent: (emitter, targetNode, eventName, body, context) => {
        return new Promise((resolve, reject) => {
          const request = this.initRequest<ApplicationRequestEvent>({
            type: PipelineType.Event,
            body,
            context,
            name: eventName,
            module: emitter,
          });
          const response: ApplicationResponse = {
            type: PipelineType.Event,
            reply: resolve,
            fail: reject,
          };
          handler(request, response);
        });
      },
    };
    this.cronCallbacks = (module, cron) => {
      return new Promise((resolve, reject) => {
        const context = new RequestContext().withValue(
          FrameworkRequestContextValues.UseCaseId,
          String(ContextIdFactory.create().id)
        );
        const request = this.initRequest<ApplicationCronData>({
          type: PipelineType.Cron,
          context,
          module,
          name: cron,
        });
        const response: ApplicationResponse = {
          type: PipelineType.Cron,
          value: { result: false },
          reply: resolve,
          fail: reject,
        };
        handler(request, response);
      });
    };
  }
  public all(
    _path: never,
    handler?: RequestHandler<ApplicationPipelineData, ApplicationResponse>
  ): void {
    if (!handler) {
      throw new Error("Provide a handler");
    }
    return this.bindHandler(handler);
  }
  use = NotSupportedNestFunction;
  get = NotSupportedNestFunction;
  post = NotSupportedNestFunction;
  head = NotSupportedNestFunction;
  delete = NotSupportedNestFunction;
  put = NotSupportedNestFunction;
  options = NotSupportedNestFunction;
  patch = NotSupportedNestFunction;
  end = NotSupportedNestFunction;
  applyVersionFilter = NotSupportedNestFunction;
  disconnect = MockedNestFunction;
  close = MockedNestFunction;
  public async listen() {
    if (!this.cqrsCallbacks || !this.eventCallbacks || !this.cronCallbacks) {
      throw new Error("Please call `all(path, handler)` first");
    }
    const brokerConnection = await this.cqrsBroker
      .connect(this.cqrsCallbacks)
      .start();
    const eventConnection = await this.eventsBroker
      .connect(this.eventCallbacks)
      .start();
    const cronsConnection = await this.cronsBroker
      .connect(this.cronCallbacks)
      .start();
    const { isListening$ } = this;
    this.disconnect = () => {
      brokerConnection.stop();
      eventConnection.stop();
      cronsConnection.stop();
      isListening$.complete();
    };
    this.close = this.disconnect;
    this.isListening$.next(true);
  }
  public reply<TApplicationResponse extends ApplicationResponse>(
    response: TApplicationResponse,
    body: QueryPipelineResult | CommandPipelineResult | CronPipelineResult
  ) {
    switch (response.type) {
      case PipelineType.Query:
        response.reply((body as QueryPipelineResult).result);
        break;
      case PipelineType.Command:
        response.reply((body as CommandPipelineResult).result);
        break;
      case PipelineType.Event:
        response.reply();
        break;
      case PipelineType.Cron:
        response.reply((body as CronPipelineResult).result);
        break;
      default:
        assertUnreachable(response);
    }
  }
  status = NotSupportedNestFunction;
  render = NotSupportedNestFunction;
  redirect = NotSupportedNestFunction;
  setHeader = NotSupportedNestFunction;
  enableCors = NotSupportedNestFunction;
  initHttpServer = NotSupportedNestFunction;
  registerParserMiddleware = NotSupportedNestFunction;
  createMiddlewareFactory = NotSupportedNestFunction;
  public getInstance() {
    return this;
  }
  public getHttpServer() {
    return {
      once: MockedNestFunction,
      address: () => {
        return "";
      },
      removeListener: MockedNestFunction,
    };
  }
  public getType(): string {
    return "AppCoreNode";
  }
  private initRequest<T extends ApplicationRequest>(
    request: Omit<T, typeof REQUEST_CONTEXT_ID>
  ): T {
    const { context } = request;
    const contextIdNumber = Number.parseInt(
      context.getOrFail(FrameworkRequestContextValues.UseCaseId),
      10
    );
    if (Number.isNaN(contextIdNumber)) {
      throw new Error("Unexpected contextId format. Not a number.");
    }
    const contextId = { id: contextIdNumber };
    const augmentedRequest = {
      ...request,
      [REQUEST_CONTEXT_ID]: contextId,
    } as T;
    if (!this.app) {
      throw new Error("Unexpected null app");
    }
    this.app.registerRequestByContextId(augmentedRequest, contextId);
    return augmentedRequest;
  }
}
