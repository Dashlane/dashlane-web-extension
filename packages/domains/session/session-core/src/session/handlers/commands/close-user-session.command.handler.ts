import { CommandHandler, ICommandHandler, } from '@dashlane/framework-application';
import { success } from '@dashlane/framework-types';
import { SessionEventEmitter } from '../../event-emiter';
import { CloseUserSessionCommand, SessionCloseMode, } from '@dashlane/session-contracts';
import { RequestContextClient } from '@dashlane/framework-contracts';
@CommandHandler(CloseUserSessionCommand)
export class CloseUserSessionCommandHandler implements ICommandHandler<CloseUserSessionCommand> {
    constructor(private emitter: SessionEventEmitter, private requestContextClient: RequestContextClient) { }
    async execute({ body: { email } }: CloseUserSessionCommand) {
        await this.emitter.sendEvent('sessionClosing', undefined);
        await this.emitter.sendEvent('sessionClosed', {
            email,
            mode: SessionCloseMode.Close,
        });
        await this.requestContextClient.commands.setActiveUser({
            userName: undefined,
        });
        return Promise.resolve(success(undefined));
    }
}
