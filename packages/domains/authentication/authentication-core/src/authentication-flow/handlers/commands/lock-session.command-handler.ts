import { Result, success } from "@dashlane/framework-types";
import { Client } from "@dashlane/framework-contracts";
import {
  AppLogger,
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { CarbonLegacyClient, CarbonModuleApi } from "@dashlane/communication";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
@CommandHandler(AuthenticationFlowContracts.LockCommand)
export class LockCommandHandler
  implements ICommandHandler<AuthenticationFlowContracts.LockCommand>
{
  private logger: AppLogger;
  private carbonLegacy: Client<
    CarbonModuleApi["commands"],
    CarbonModuleApi["queries"]
  >;
  public constructor(
    carbonLegacyClient: CarbonLegacyClient,
    logger: AppLogger
  ) {
    this.carbonLegacy = carbonLegacyClient;
    this.logger = logger;
  }
  public async execute(): Promise<Result<undefined>> {
    try {
      await this.carbonLegacy.commands.carbonLegacyLeeloo({
        name: "lockSession",
        arg: [{}],
      });
    } catch (error) {
      this.logger.trace("LockSession command handler: " + error);
    }
    return Promise.resolve(success(undefined));
  }
}
