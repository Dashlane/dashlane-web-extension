import { AnyModuleApis, ApplicationDefinition, NodeIdentifiersOf, } from '@dashlane/framework-contracts';
import { assertUnreachable, Result, success } from '@dashlane/framework-types';
import { HttpServer } from '@nestjs/common';
import { RequestHandler } from '@nestjs/common/interfaces';
import { BehaviorSubject, EMPTY, from, mergeAll, Observable } from 'rxjs';
import { CqrsBroker, NodeEventBroker } from '../../client';
import { CqrsCallbacks } from '../../client/cqrs-broker';
import { LocalEventCallback } from '../../client/node-event-broker';
import { ApplicationPipelineData, ApplicationResponse, CommandPipelineResult, CronPipelineResult, PipelineType, QueryPipelineResult, } from './nest-request-response-bus';
import { RequestContext } from '../../request-context';
import { CronsBroker } from '../../tasks/crons-broker';
const  = () => { };
const NotSupportedNestFunction = (): never => {
    throw new Error('Not supported');
};
export class ApplicationNodeHttpServer<TAppDefinition extends ApplicationDefinition<string, AnyModuleApis>, TCurrentNode extends NodeIdentifiersOf<TAppDefinition>> implements HttpServer<ApplicationPipelineData, ApplicationResponse> {
    constructor(private cqrsBroker: CqrsBroker<TAppDefinition, TCurrentNode>, private eventsBroker: NodeEventBroker<TAppDefinition, TCurrentNode>, private cronsBroker: CronsBroker) { }
    public readonly isListening$ = new BehaviorSubject(false);
    private cqrsCallbacks?: CqrsCallbacks<TAppDefinition>;
    private eventCallbacks?: LocalEventCallback<TAppDefinition>;
    private cronCallbacks?: (module: string, cronName: string) => Promise<boolean>;
    public isHeadersSent(): boolean {
        return false;
    }
    private bindHandler(handler: RequestHandler<ApplicationPipelineData, ApplicationResponse>): void {
        if (this.cqrsCallbacks || this.eventCallbacks) {
            throw new Error('Handler already registered');
        }
        this.cqrsCallbacks = {
            onCommand: (module, commandName, body, context) => {
                return new Promise<Result<unknown, unknown>>((resolve, reject) => {
                    handler({
                        type: PipelineType.Command,
                        module,
                        name: commandName,
                        body,
                        context,
                    }, {
                        type: PipelineType.Command,
                        value: { result: success(undefined) },
                        reply: (value) => resolve(value),
                        fail: (err) => reject(err),
                    });
                });
            },
            onQuery: (module, queryName, body, context) => {
                const observablePromise = new Promise<Observable<Result<unknown, unknown>>>((resolve, reject) => {
                    handler({
                        type: PipelineType.Query,
                        module,
                        name: queryName,
                        body,
                        context,
                    }, {
                        type: PipelineType.Query,
                        value: { result: EMPTY },
                        reply: (value) => resolve(value),
                        fail: (err) => reject(err),
                    });
                });
                return from(observablePromise).pipe(mergeAll());
            },
        };
        this.eventCallbacks = {
            onLocalEvent: (emitter, targetNode, eventName, body, context) => new Promise((resolve, reject) => {
                handler({
                    type: PipelineType.Event,
                    body,
                    context,
                    name: eventName,
                    module: emitter,
                }, {
                    type: PipelineType.Event,
                    reply: () => resolve(),
                    fail: (err) => reject(err),
                });
            }),
        };
        this.cronCallbacks = (module, cron) => new Promise((resolve, reject) => {
            handler({
                type: PipelineType.Cron,
                context: new RequestContext(),
                module,
                name: cron,
            }, {
                type: PipelineType.Cron,
                value: { result: false },
                reply: (value) => resolve(value),
                fail: (err) => reject(err),
            });
        });
    }
    public all(_path: never, handler?: RequestHandler<ApplicationPipelineData, ApplicationResponse>): void {
        if (!handler) {
            throw new Error('Provide a handler');
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
    disconnect = ;
    close = ;
    public async listen() {
        if (!this.cqrsCallbacks || !this.eventCallbacks || !this.cronCallbacks) {
            throw new Error('Please call `all(path, handler)` first');
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
    public reply<TApplicationResponse extends ApplicationResponse>(response: TApplicationResponse, body: QueryPipelineResult | CommandPipelineResult | CronPipelineResult) {
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
            once: ,
            address: () => {
                return '';
            },
            removeListener: ,
        };
    }
    public getType(): string {
        return 'AppCoreNode';
    }
}
