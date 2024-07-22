import { firstValueFrom } from "rxjs";
import { CarbonLegacyClient, isSecret, Secret } from "@dashlane/communication";
import { Injectable } from "@dashlane/framework-application";
import { isFailure } from "@dashlane/framework-types";
function isSecretArray(x: unknown): x is Secret[] {
  return Array.isArray(x) && x.every(isSecret);
}
@Injectable()
export class SecretsGetterService {
  public constructor(private client: CarbonLegacyClient) {}
  public async getCarbonSecretsByItemIds(itemIds: string[]): Promise<Secret[]> {
    const {
      queries: { carbonState },
    } = this.client;
    const allSecretsFromCarbon = await firstValueFrom(
      carbonState({
        path: "userSession.personalData.secrets",
      })
    );
    if (isFailure(allSecretsFromCarbon)) {
      throw new Error("Unable to access secrets from carbon");
    }
    const allSecrets = allSecretsFromCarbon.data;
    if (!allSecrets) {
      throw new Error("No secrets found");
    }
    if (!isSecretArray(allSecrets)) {
      throw new Error("Secrets are invalid");
    }
    const allSecretsById = allSecrets.reduce(
      (
        acc: {
          [k: Secret["Id"]]: Secret;
        },
        curr
      ) => {
        acc[curr.Id] = curr;
        return acc;
      },
      {}
    );
    const secrets = itemIds.reduce((acc: Array<Secret>, curr) => {
      if (curr in allSecretsById) {
        acc.push(allSecretsById[curr]);
      }
      return acc;
    }, []);
    return secrets;
  }
}
