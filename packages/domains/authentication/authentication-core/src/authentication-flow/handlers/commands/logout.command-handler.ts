import { Result, success } from "@dashlane/framework-types";
import { Client } from "@dashlane/framework-contracts";
import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { CarbonLegacyClient, CarbonModuleApi } from "@dashlane/communication";
import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
import { AuthenticationFlowModuleLogger } from "../../utils/logger";
@CommandHandler(AuthenticationFlowContracts.LogoutCommand)
export class LogoutCommandHandler
  implements ICommandHandler<AuthenticationFlowContracts.LogoutCommand>
{
  private logger: AuthenticationFlowModuleLogger;
  private carbonLegacy: Client<
    CarbonModuleApi["commands"],
    CarbonModuleApi["queries"]
  >;
  public constructor(
    carbonLegacyClient: CarbonLegacyClient,
    logger: AuthenticationFlowModuleLogger
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
