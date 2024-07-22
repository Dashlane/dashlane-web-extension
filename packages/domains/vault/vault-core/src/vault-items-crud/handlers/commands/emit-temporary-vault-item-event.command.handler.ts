import {
  CommandHandler,
  CommandHandlerResponseOf,
  ICommandHandler,
} from "@dashlane/framework-application";
import { success } from "@dashlane/framework-types";
import {
  EmitTemporaryVaultItemEventCommand,
  VaultItemType,
} from "@dashlane/vault-contracts";
import { VaultItemsCommandEventsEmitter } from "../events/events-emitter";
@CommandHandler(EmitTemporaryVaultItemEventCommand)
export class EmitTemporaryVaultItemsEventCommandHandler
  implements ICommandHandler<EmitTemporaryVaultItemEventCommand>
{
  constructor(private eventEmitter: VaultItemsCommandEventsEmitter) {}
  execute({
    body,
  }: EmitTemporaryVaultItemEventCommand): CommandHandlerResponseOf<EmitTemporaryVaultItemEventCommand> {
    const { ids, eventType } = body;
    this.eventEmitter.sendEvent(eventType, {
      ids,
      vaultItemType: VaultItemType.Credential,
    });
    return Promise.resolve(success(undefined));
  }
}
