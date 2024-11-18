import { Result, success } from "@dashlane/framework-types";
import {
  CommandHandler,
  ICommandHandler,
  StoreFlusher,
} from "@dashlane/framework-application";
import { FlushLocalDataCommand } from "@dashlane/session-contracts";
@CommandHandler(FlushLocalDataCommand)
export class FlushLocalDataCommandHandler
  implements ICommandHandler<FlushLocalDataCommand>
{
  public constructor(private storeFlusher: StoreFlusher) {}
  public async execute(): Promise<Result<undefined>> {
    await this.storeFlusher.flush();
    return Promise.resolve(success(undefined));
  }
}
