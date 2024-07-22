import { Injectable } from "@dashlane/framework-application";
import { Client } from "@dashlane/framework-contracts";
import { CarbonLegacyClient, CarbonModuleApi } from "@dashlane/communication";
interface Params {
  login?: string;
}
@Injectable()
export class SendEmailToken {
  private carbonLegacy: Client<
    CarbonModuleApi["commands"],
    CarbonModuleApi["queries"]
  >;
  public constructor(carbonLegacyClient: CarbonLegacyClient) {
    this.carbonLegacy = carbonLegacyClient;
  }
  public async execute(context: Params) {
    try {
      await this.carbonLegacy.commands.carbonLegacyLeeloo({
        name: "openSessionResendToken",
        arg: [
          {
            login: context.login ?? "",
          },
        ],
      });
      return Promise.resolve();
    } catch (error) {}
  }
}
