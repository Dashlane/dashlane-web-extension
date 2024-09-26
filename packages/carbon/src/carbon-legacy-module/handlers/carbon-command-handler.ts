import { CarbonCommand } from "@dashlane/communication";
import {
  CommandHandler,
  CommandHandlerResponseOf,
  ICommandHandler,
  RequestContext,
} from "@dashlane/framework-application";
import { CarbonLegacyInfrastructure } from "../carbon-legacy-infrastructure";
import { CarbonEventEmitter } from "../carbon-events-emitter";
import { carbonResultToModuleResult } from "./helpers/carbon-result";
@CommandHandler(CarbonCommand)
export class CarbonCommandHandler implements ICommandHandler<CarbonCommand> {
  constructor(
    private infra: CarbonLegacyInfrastructure,
    private eventsEmitter: CarbonEventEmitter,
    private context: RequestContext
  ) {}
  async execute({
    body: { args, name, fireEvent },
  }: CarbonCommand): CommandHandlerResponseOf<CarbonCommand> {
    const carbon = await this.infra.getCarbon();
    const toExecute = carbon.apiEvents[name];
    const result = await toExecute(...args);
    const moduleResult = carbonResultToModuleResult(result);
    if (fireEvent) {
      await this.eventsEmitter.sendEvent(
        "carbonCommandResult",
        {
          result,
        },
        this.context
      );
    }
    return moduleResult;
  }
}
