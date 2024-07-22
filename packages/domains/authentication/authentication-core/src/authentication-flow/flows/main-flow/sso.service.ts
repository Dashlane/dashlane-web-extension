import { Injectable } from "@dashlane/framework-application";
import { Client } from "@dashlane/framework-contracts";
import { CarbonLegacyClient, CarbonModuleApi } from "@dashlane/communication";
import { LegacySSOLoginEvent } from "./authentication.events";
@Injectable()
export class LegacySSOLoginService {
  private carbonLegacy: Client<
    CarbonModuleApi["commands"],
    CarbonModuleApi["queries"]
  >;
  public constructor(carbonLegacyClient: CarbonLegacyClient) {
    this.carbonLegacy = carbonLegacyClient;
  }
  public async execute(event: LegacySSOLoginEvent) {
    await this.carbonLegacy.commands.carbon({
      name: "loginViaSSO",
      args: [event],
    });
  }
}
