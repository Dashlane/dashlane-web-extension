import { Injectable } from "@dashlane/framework-application";
import { Client } from "@dashlane/framework-contracts";
import { CarbonLegacyClient, CarbonModuleApi } from "@dashlane/communication";
interface Params {
  login: string;
  masterPassword: string | null;
  otp?: string;
  twoFactorAuthenticationOtpType?: string;
  persistData: boolean;
  otpVerificationMode?: string;
  deviceName?: string;
}
@Injectable()
export class TwoFactorAuthenticationService {
  private carbonLegacy: Client<
    CarbonModuleApi["commands"],
    CarbonModuleApi["queries"]
  >;
  public constructor(carbonLegacyClient: CarbonLegacyClient) {
    this.carbonLegacy = carbonLegacyClient;
  }
  public executeWithParams({
    login,
    masterPassword,
    otp,
    twoFactorAuthenticationOtpType,
    otpVerificationMode,
    deviceName,
  }: Params) {
    const req = {
      login: login,
      password: masterPassword ?? null,
      otp,
      withBackupCode: twoFactorAuthenticationOtpType === "backupCode",
      persistData: true,
    };
    try {
      if (otpVerificationMode === "otp2") {
        this.carbonLegacy.commands.carbonLegacyLeeloo({
          name: "openSessionWithOTP",
          arg: [
            {
              ...req,
              deviceName: deviceName,
            },
          ],
        });
      } else if (otpVerificationMode === "otp1") {
        this.carbonLegacy.commands.carbonLegacyLeeloo({
          name: "openSessionWithOTPForNewDevice",
          arg: [req],
        });
      }
    } catch (error) {}
    return Promise.resolve();
  }
}
