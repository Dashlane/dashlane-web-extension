import { success } from "@dashlane/framework-types";
import { ExceptionLogger } from "../exception-logger";
import { EnableExceptionLogCommand } from "@dashlane/framework-contracts";
import { CommandHandler } from "../../cqrs/commands.decorators";
import {
  CommandHandlerResponseOf,
  ICommandHandler,
} from "../../cqrs/commands.types";
@CommandHandler(EnableExceptionLogCommand)
export class EnableExceptionLogCommandHandler
  implements ICommandHandler<EnableExceptionLogCommand>
{
  constructor(private readonly logger: ExceptionLogger) {}
  execute({
    body: { flag },
  }: EnableExceptionLogCommand): CommandHandlerResponseOf<EnableExceptionLogCommand> {
    this.logger.setEnableExceptionLogsSend(flag);
    return Promise.resolve(success(undefined));
  }
}
