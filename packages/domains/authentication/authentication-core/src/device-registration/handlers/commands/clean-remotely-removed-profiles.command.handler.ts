import {
  CommandHandler,
  ICommandHandler,
} from "@dashlane/framework-application";
import { CleanRemotelyRemovedProfilesCommand } from "@dashlane/authentication-contracts";
import { isFailure, Result, success } from "@dashlane/framework-types";
import { CarbonLegacyClient } from "@dashlane/communication";
@CommandHandler(CleanRemotelyRemovedProfilesCommand)
export class CleanRemotelyRemovedProfilesCommandHandler
  implements ICommandHandler<CleanRemotelyRemovedProfilesCommand>
{
  constructor(private carbon: CarbonLegacyClient) {}
  public async execute(): Promise<Result<undefined>> {
    const result = await this.carbon.commands.cleanRemotelyRemovedProfiles();
    if (isFailure(result)) {
      throw new Error("clean remotely removed profiles failed");
    }
    return success(undefined);
  }
}
