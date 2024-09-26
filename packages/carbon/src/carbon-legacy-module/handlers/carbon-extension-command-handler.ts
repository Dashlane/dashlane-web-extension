import {
  CarbonCommandError,
  CarbonCommandResult,
  CarbonLegacyLeelooCommand,
} from "@dashlane/communication";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { Result } from "@dashlane/framework-types";
import { CarbonLegacyInfrastructure } from "../carbon-legacy-infrastructure";
import { CarbonEventEmitter } from "../carbon-events-emitter";
import { carbonResultToModuleResult } from "./helpers/carbon-result";
@CommandHandler(CarbonLegacyLeelooCommand)
export class CarbonLegacyLeelooCommandHandler
  implements ICommandHandler<CarbonLegacyLeelooCommand>
{
  constructor(
    private infra: CarbonLegacyInfrastructure,
    private eventsEmitter: CarbonEventEmitter
  ) {}
  async execute({
    body: { arg, name, fireEvent },
  }: CarbonLegacyLeelooCommand): Promise<
    Result<CarbonCommandResult, CarbonCommandError>
  > {
    const carbon = await this.infra.getCarbon();
    const toExecute = carbon.leelooEventsCommands[name] as (
      ...param: unknown[]
    ) => Promise<unknown> | unknown;
    const result = await toExecute(...arg);
    const moduleResult = carbonResultToModuleResult(result);
    if (!fireEvent) {
      return moduleResult;
    }
    await this.eventsEmitter.sendEvent("carbonCommandResult", {
      result,
    });
    return moduleResult;
  }
}
