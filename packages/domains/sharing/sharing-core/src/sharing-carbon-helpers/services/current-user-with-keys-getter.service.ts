import { firstValueFrom } from "rxjs";
import { CarbonLegacyClient } from "@dashlane/communication";
import { Injectable } from "@dashlane/framework-application";
import { matchResultObservable } from "@dashlane/framework-types";
export interface CurrentUserWithKeyPair {
  login: string;
  privateKey: string;
  publicKey: string;
}
@Injectable()
export class CurrentUserWithKeysGetterService {
  constructor(private client: CarbonLegacyClient) {}
  public async getCurrentUserWithKeys(): Promise<CurrentUserWithKeyPair> {
    const {
      queries: { carbonStateList },
    } = this.client;
    return await firstValueFrom(
      carbonStateList({
        paths: [
          "userSession.account.login",
          "userSession.session.keyPair.publicKey",
          "userSession.session.keyPair.privateKey",
        ],
      }).pipe(
        matchResultObservable({
          success: ([login, publicKeyPem, privateKeyPem]) => {
            if (
              typeof login !== "string" ||
              typeof publicKeyPem !== "string" ||
              typeof privateKeyPem !== "string"
            ) {
              throw new Error("Invalid format of current user keys");
            }
            return {
              login,
              publicKey: publicKeyPem,
              privateKey: privateKeyPem,
            };
          },
          failure: () => {
            throw new Error("Failure getting current user and key pair");
          },
        })
      )
    );
  }
}
