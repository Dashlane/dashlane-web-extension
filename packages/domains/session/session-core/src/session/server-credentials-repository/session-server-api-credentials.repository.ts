import { ServerApiCredentialsRepository } from "@dashlane/framework-dashlane-application";
import { Injectable } from "@dashlane/framework-application";
import { CurrentSessionInfoRepository } from "../services/current-session-infos.repository";
import { firstValueFrom } from "rxjs";
import { RequestUserDeviceCredentials } from "@dashlane/server-sdk";
@Injectable()
export class SessionServerApiCredentialsRepository
  implements ServerApiCredentialsRepository
{
  constructor(private readonly repository: CurrentSessionInfoRepository) {}
  public async getDeviceCredentialsForUser(
    userName: string
  ): Promise<RequestUserDeviceCredentials> {
    const infos = await firstValueFrom(this.repository.getInfos());
    if (infos.login !== userName) {
      throw new Error("Cant get the credentials of another user");
    }
    return {
      deviceAccessKey: infos.deviceKeys.accessKey,
      deviceSecretKey: infos.deviceKeys.secretKey,
      login: infos.login,
    };
  }
}
