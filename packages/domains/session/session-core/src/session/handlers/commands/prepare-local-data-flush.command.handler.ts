import { Result, success } from '@dashlane/framework-types';
import { CommandHandler, ICommandHandler, StoreFlusher, } from '@dashlane/framework-application';
import { PrepareLocalDataFlushCommand } from '@dashlane/session-contracts';
@CommandHandler(PrepareLocalDataFlushCommand)
export class PrepareLocalDataFlushCommandHandler implements ICommandHandler<PrepareLocalDataFlushCommand> {
    public constructor(private storeFlusher: StoreFlusher) { }
    public async execute(): Promise<Result<undefined>> {
        await this.storeFlusher.prepare();
        return Promise.resolve(success(undefined));
    }
}
