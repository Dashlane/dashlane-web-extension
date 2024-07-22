import { Injectable } from "@dashlane/framework-application";
import { Client } from "@dashlane/framework-contracts";
import {
  CarbonLegacyClient,
  CarbonModuleApi,
  OpenSessionWithDashlaneAuthenticator,
} from "@dashlane/communication";
interface Params {
  login?: string;
}
@Injectable()
export class DashlaneAuthenticatorService {
  private carbonLegacy: Client<
    CarbonModuleApi["commands"],
    CarbonModuleApi["queries"]
  >;
  public constructor(carbonLegacyClient: CarbonLegacyClient) {
    this.carbonLegacy = carbonLegacyClient;
  }
  public async requestCodeAgainstServer() {}
  public async execute({ login }: Params) {
    await this.carbonLegacy.commands.carbonLegacyLeeloo({
      name: "openSessionWithDashlaneAuthenticator",
      arg: [
        {
          login: login,
          password: null,
          persistData: true,
          deviceName: "",
        } as OpenSessionWithDashlaneAuthenticator,
      ],
    });
    return Promise.resolve();
  }
  public async cancel() {
    await this.carbonLegacy.commands.carbonLegacyLeeloo({
      name: "cancelDashlaneAuthenticatorRegistration",
      arg: [],
    });
    return Promise.resolve();
  }
}
