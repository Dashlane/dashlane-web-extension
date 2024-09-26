import { MitigationDeleteGrapheneUserDataCommand } from "@dashlane/communication";
import {
  CommandHandler,
  ICommandHandler,
  KeyValueStorageInfrastructure,
} from "@dashlane/framework-application";
import { Result, success } from "@dashlane/framework-types";
import { CarbonEventEmitter } from "carbon-legacy-module/carbon-events-emitter";
@CommandHandler(MitigationDeleteGrapheneUserDataCommand)
export class DeleteGrapheneUserDataCommandHandler
  implements ICommandHandler<MitigationDeleteGrapheneUserDataCommand>
{
  constructor(
    private infra: KeyValueStorageInfrastructure,
    private emitter: CarbonEventEmitter
  ) {}
  async execute({
    body: { login },
  }: MitigationDeleteGrapheneUserDataCommand): Promise<Result<undefined>> {
    await this.emitter.sendEvent("CarbonLegacyDeviceRemotelyDeleted", {
      user: login,
    });
    const keys = await this.infra.getAllKeys();
    const suffix = `.${login}`;
    const toDeleteKeys = keys.filter((k) => k.endsWith(suffix));
    const tasks = toDeleteKeys.map(async (k) => await this.infra.remove(k));
    await Promise.allSettled(tasks);
    return success(null);
  }
}
