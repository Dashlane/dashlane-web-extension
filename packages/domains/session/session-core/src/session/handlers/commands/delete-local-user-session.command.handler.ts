import { CommandHandler, ICommandHandler, } from '@dashlane/framework-application';
import { success } from '@dashlane/framework-types';
import { DeleteLocalSessionCommand } from '@dashlane/session-contracts';
@CommandHandler(DeleteLocalSessionCommand)
export class DeleteLocalSessionCommandHandler implements ICommandHandler<DeleteLocalSessionCommand> {
    execute() {
        return Promise.resolve(success(undefined));
    }
}
