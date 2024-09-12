import { AnyAppDefinition, NodeIdentifiersOf, } from '@dashlane/framework-contracts';
import { RequestMethod } from '@nestjs/common';
import { AbstractHttpAdapter } from '@nestjs/core';
import { Observable } from 'rxjs';
import { CqrsBroker, NodeEventBroker } from '../../client';
import { ApplicationNodeHttpServer } from './application-node-server-adapter';
import { CronsBroker } from '../../tasks/crons-broker';
const  = () => { };
export class ApplicationNodeAdapter<TAppDefinition extends AnyAppDefinition, TCurrentNode extends NodeIdentifiersOf<TAppDefinition>> extends AbstractHttpAdapter {
    public readonly isListening$: Observable<boolean>;
    constructor(cqrsBroker: CqrsBroker<TAppDefinition, TCurrentNode>, eventsBroker: NodeEventBroker<TAppDefinition, TCurrentNode>, cronsBroker: CronsBroker) {
        super(new ApplicationNodeHttpServer(cqrsBroker, eventsBroker, cronsBroker));
        this.isListening$ = this.instance.isListening$;
    }
    initHttpServer(): void {
        this.setHttpServer({
            once: ,
            address: () => {
                return '';
            },
            removeListener: ,
        });
    }
    getRequestMethod(): RequestMethod {
        return RequestMethod.ALL;
    }
    getRequestUrl(): string {
        return '/';
    }
    getType(): string {
        return 'CoreApp';
    }
    createMiddlewareFactory = this.instance.createMiddlewareFactory;
    close = this.instance.close;
    reply = this.instance.reply;
    useStaticAssets = ;
    setViewEngine = ;
    getRequestHostname = ;
    status = ;
    render = ;
    redirect = ;
    setNotFoundHandler = ;
    setHeader = ;
    registerParserMiddleware = ;
    enableCors = ;
    setErrorHandler = ;
    end = ;
    getHeader = ;
    appendHeader = ;
    isHeadersSent(): boolean {
        return false;
    }
    applyVersionFilter(): (req: any, res: any, next: () => void) => Function {
        throw new Error('Versioning not supported');
    }
}
