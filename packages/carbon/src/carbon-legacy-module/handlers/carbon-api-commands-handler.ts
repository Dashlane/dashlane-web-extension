import { EventDeclaration, Slot } from "ts-event-bus";
import { commandsFromCarbonAPI } from "@dashlane/communication";
import {
  AnyFunctionalError,
  Class,
  InstanceOf,
  success,
  ValuesType,
} from "@dashlane/framework-types";
import { CommandMessage } from "@dashlane/framework-contracts";
import {
  CommandHandler,
  CommandInfo,
  ICommandHandler,
  Injectable,
} from "@dashlane/framework-application";
import { CarbonLegacyInfrastructure } from "../carbon-legacy-infrastructure";
type AnyCommandFromCarbonApi = InstanceOf<
  ValuesType<typeof commandsFromCarbonAPI>
>;
type SlotResponseData<TSlot> = TSlot extends Slot<unknown, infer TResponseData>
  ? TResponseData
  : never;
@Injectable()
export class CarbonApiCommandsHandler
  implements ICommandHandler<AnyCommandFromCarbonApi>
{
  public constructor(infrastructure: CarbonLegacyInfrastructure) {
    this.infrastructure = infrastructure;
  }
  public async execute(
    command: AnyCommandFromCarbonApi,
    { name }: CommandInfo
  ) {
    const { apiEvents } = await this.infrastructure.getCarbon();
    const { body } = command;
    const res = await (apiEvents[name](body) as Promise<
      SlotResponseData<typeof command>
    >);
    return success(res);
  }
  private infrastructure: CarbonLegacyInfrastructure;
}
Object.values(commandsFromCarbonAPI).forEach((command) =>
  CommandHandler(command)(CarbonApiCommandsHandler)
);
export function createHandlersConfigForConnectorCommands<
  TCommandsConnectorDeclaration extends EventDeclaration
>(
  commandsConnector: TCommandsConnectorDeclaration,
  handlerClass: Class<ICommandHandler<any>>
) {
  return Object.keys(commandsConnector).reduce(
    (acc, slotName: keyof TCommandsConnectorDeclaration) => ({
      ...acc,
      [slotName]: handlerClass,
    }),
    {} as {
      [TCommand in keyof TCommandsConnectorDeclaration]: Class<
        ICommandHandler<CommandMessage<unknown, unknown, AnyFunctionalError>>,
        never[]
      >;
    }
  );
}
