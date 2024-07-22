import { Injectable } from "@dashlane/framework-application";
import { Client } from "@dashlane/framework-contracts";
import { CarbonLegacyClient, CarbonModuleApi } from "@dashlane/communication";
interface Params {
  deviceName?: string;
  emailToken?: string;
  login?: string;
}
@Injectable()
export class AuthenticateWithEmailToken {
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
        name: "openSessionWithToken",
        arg: [
          {
            login: context.login ?? "",
            password: null,
            token: context.emailToken ?? "",
            persistData: true,
            deviceName: context.deviceName,
          },
        ],
      });
    } catch (error) {}
  }
}
