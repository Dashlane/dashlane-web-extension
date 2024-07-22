import { Injectable } from "@dashlane/framework-application";
import { CarbonLegacyClient } from "@dashlane/communication";
interface Params {
  login?: string;
}
@Injectable()
export class CheckAccountTypeService {
  public constructor(private carbonLegacy: CarbonLegacyClient) {}
  public async execute({ login }: Params) {
    await this.carbonLegacy.commands.carbonLegacyLeeloo({
      name: "openSession",
      arg: [
        {
          login: login ?? "",
        },
      ],
    });
  }
}
