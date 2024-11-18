import {
  AnyAppDefinition,
  NodeIdentifiersOf,
} from "@dashlane/framework-contracts";
import { type INestApplication, RequestMethod } from "@nestjs/common";
import { AbstractHttpAdapter } from "@nestjs/core";
import { Observable } from "rxjs";
import { CqrsBroker, NodeEventBroker } from "../../client";
import { ApplicationNodeHttpServer } from "./application-node-server-adapter";
import { CronsBroker } from "../../tasks/crons-broker";
const MockedNestFunction = () => {};
export class ApplicationNodeAdapter<
  TAppDefinition extends AnyAppDefinition,
  TCurrentNode extends NodeIdentifiersOf<TAppDefinition>
> extends AbstractHttpAdapter {
  public readonly isListening$: Observable<boolean>;
  constructor(
    cqrsBroker: CqrsBroker<TAppDefinition, TCurrentNode>,
    eventsBroker: NodeEventBroker<TAppDefinition, TCurrentNode>,
    cronsBroker: CronsBroker
  ) {
    super(new ApplicationNodeHttpServer(cqrsBroker, eventsBroker, cronsBroker));
    this.isListening$ = this.instance.isListening$;
  }
  setAppInstance(app: INestApplication) {
    const instance: ApplicationNodeHttpServer<TAppDefinition, TCurrentNode> =
      this.getInstance();
    instance.setAppInstance(app);
  }
  initHttpServer(): void {
    this.setHttpServer({
      once: MockedNestFunction,
      address: () => {
        return "";
      },
      removeListener: MockedNestFunction,
    });
  }
  getRequestMethod(): RequestMethod {
    return RequestMethod.ALL;
  }
  getRequestUrl(): string {
    return "/";
  }
  getType(): string {
    return "CoreApp";
  }
  createMiddlewareFactory = this.instance.createMiddlewareFactory;
  close = this.instance.close;
  reply = this.instance.reply;
  useStaticAssets = MockedNestFunction;
  setViewEngine = MockedNestFunction;
  getRequestHostname = MockedNestFunction;
  status = MockedNestFunction;
  render = MockedNestFunction;
  redirect = MockedNestFunction;
  setNotFoundHandler = MockedNestFunction;
  setHeader = MockedNestFunction;
  registerParserMiddleware = MockedNestFunction;
  enableCors = MockedNestFunction;
  setErrorHandler = MockedNestFunction;
  end = MockedNestFunction;
  getHeader = MockedNestFunction;
  appendHeader = MockedNestFunction;
  isHeadersSent(): boolean {
    return false;
  }
  applyVersionFilter(): (req: any, res: any, next: () => void) => Function {
    throw new Error("Versioning not supported");
  }
}
