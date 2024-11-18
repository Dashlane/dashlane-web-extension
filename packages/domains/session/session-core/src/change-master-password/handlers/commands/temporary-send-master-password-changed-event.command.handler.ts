import { TemporarySendMasterPasswordChangedEventCommand } from "@dashlane/session-contracts";
import {
  CommandHandler,
  CommandHandlerResponseOf,
  ICommandHandler,
} from "@dashlane/framework-application";
import { success } from "@dashlane/framework-types";
import { ChangeMasterPasswordEventsEmitterService } from "../../services";
@CommandHandler(TemporarySendMasterPasswordChangedEventCommand)
export class TemporarySendMasterPasswordChangedEventCommandHandler
  implements ICommandHandler<TemporarySendMasterPasswordChangedEventCommand>
{
  constructor(private eventEmitter: ChangeMasterPasswordEventsEmitterService) {}
  execute(): CommandHandlerResponseOf<TemporarySendMasterPasswordChangedEventCommand> {
    this.eventEmitter.sendEvent("masterPasswordChanged", undefined);
    return Promise.resolve(success(undefined));
  }
}
