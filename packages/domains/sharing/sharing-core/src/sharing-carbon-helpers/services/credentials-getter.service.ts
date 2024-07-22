import { firstValueFrom } from "rxjs";
import {
  CarbonLegacyClient,
  Credential,
  isCredential,
} from "@dashlane/communication";
import { Injectable } from "@dashlane/framework-application";
import { isFailure } from "@dashlane/framework-types";
function isCredentialArray(x: unknown): x is Credential[] {
  return Array.isArray(x) && x.every(isCredential);
}
@Injectable()
export class CredentialsGetterService {
  public constructor(private client: CarbonLegacyClient) {}
  public async getCarbonCredentialsByItemIds(
    itemIds: string[]
  ): Promise<Credential[]> {
    const {
      queries: { carbonState },
    } = this.client;
    const allCredentialsFromCarbon = await firstValueFrom(
      carbonState({
        path: "userSession.personalData.credentials",
      })
    );
    if (isFailure(allCredentialsFromCarbon)) {
      throw new Error("Unable to access credentials from carbon");
    }
    const allCredentials = allCredentialsFromCarbon.data;
    if (!allCredentials) {
      throw new Error("No credentials found");
    }
    if (!isCredentialArray(allCredentials)) {
      throw new Error("Credentials are invalid");
    }
    const allCredentialsById = allCredentials.reduce(
      (
        acc: {
          [k: Credential["Id"]]: Credential;
        },
        curr
      ) => {
        acc[curr.Id] = curr;
        return acc;
      },
      {}
    );
    const credentials = itemIds.reduce((acc: Array<Credential>, curr) => {
      if (curr in allCredentialsById) {
        acc.push(allCredentialsById[curr]);
      }
      return acc;
    }, []);
    return credentials;
  }
}
