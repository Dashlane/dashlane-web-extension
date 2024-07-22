import { Injectable } from "@dashlane/framework-application";
import { Client } from "@dashlane/framework-contracts";
import { CarbonLegacyClient, CarbonModuleApi } from "@dashlane/communication";
import { isSuccess } from "@dashlane/framework-types";
import { CheckAccountRecoveryStatusResult } from "../../main-flow/types";
type CheckDoesLocalRecoveryKeyExistResult = {
  success: boolean;
  doesExist: boolean;
};
@Injectable()
export class AccountRecoveryStatusService {
  private carbonLegacy: Client<
    CarbonModuleApi["commands"],
    CarbonModuleApi["queries"]
  >;
  public constructor(carbonLegacyClient: CarbonLegacyClient) {
    this.carbonLegacy = carbonLegacyClient;
  }
  public async execute(): Promise<CheckAccountRecoveryStatusResult> {
    try {
      const result = await this.carbonLegacy.commands.carbon({
        name: "checkDoesLocalRecoveryKeyExist",
        args: [],
      });
      if (!isSuccess(result)) {
        throw new Error("Carbon command failed");
      }
      return {
        isAccountRecoveryAvailable: (
          result.data.carbonResult as CheckDoesLocalRecoveryKeyExistResult
        ).doesExist,
      };
    } catch (error) {
      return {
        isAccountRecoveryAvailable: false,
      };
    }
  }
}
