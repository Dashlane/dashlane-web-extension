import { Result, success } from "@dashlane/framework-types";
import { Client } from "@dashlane/framework-contracts";
import {
  AppLogger,
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { CarbonLegacyClient, CarbonModuleApi } from "@dashlane/communication";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
@CommandHandler(AuthenticationFlowContracts.LogoutCommand)
export class LogoutCommandHandler
  implements ICommandHandler<AuthenticationFlowContracts.LogoutCommand>
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
        name: "closeSession",
        arg: [{}],
      });
    } catch (error) {
      this.logger.trace("Logout Command error :" + error);
    }
    return Promise.resolve(success(undefined));
  }
}
