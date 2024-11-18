import { firstValueFrom } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { CarbonLegacyClient } from "@dashlane/communication";
import { matchResultObservable } from "@dashlane/framework-types";
import {
  DEFAULT_CBCHMAC64_CIPHER_CONFIG,
  DEFAULT_CBCHMAC_CIPHER_CONFIG,
  DEFAULT_FLEXIBLE_ARGON2D_DERIVATION_CONFIG,
  DEFAULT_NODERIVATION_CONFIG,
  FlexibleArgon2dDerivationConfig,
  FlexiblePbkdf2DerivationConfig,
} from "@dashlane/framework-services";
import {
  base64ToArrayBuffer,
  textToArrayBuffer,
  utf8ChunkEncode,
} from "@dashlane/framework-encoding";
import {
  FlexibleEncryptor,
  RandomValuesGetter,
} from "@dashlane/framework-dashlane-application";
import { makeDerivationConfig } from "../crypto-config/helpers";
@Injectable()
export class LocalDataKeyEncryptor {
  public constructor(
    private carbonLegacyClient: CarbonLegacyClient,
    private flexibleEncryptor: FlexibleEncryptor,
    private randomValuesGetter: RandomValuesGetter
  ) {}
  public async encrypt(clearContents: ArrayBuffer): Promise<ArrayBuffer> {
    const { carbonStateList } = this.carbonLegacyClient.queries;
    return await firstValueFrom(
      carbonStateList({
        paths: [
          "userSession.session.localKey",
          "userSession.session.masterPassword",
          "userSession.session.serverKey",
          "userSession.personalSettings.CryptoFixedSalt",
          "userSession.personalSettings.CryptoUserPayload",
        ],
      }).pipe(
        matchResultObservable({
          success: ([
            localKey,
            masterPassword,
            serverKey,
            fixedSalt,
            marker,
          ]) => {
            if (typeof localKey === "string") {
              return this.flexibleEncryptor.encrypt(
                textToArrayBuffer(localKey),
                clearContents,
                DEFAULT_NODERIVATION_CONFIG,
                DEFAULT_CBCHMAC64_CIPHER_CONFIG
              );
            } else if (
              typeof masterPassword === "string" &&
              typeof serverKey === "string"
            ) {
              const key = serverKey + masterPassword;
              const keyUtf8 = utf8ChunkEncode(key);
              const derivationConfig:
                | FlexibleArgon2dDerivationConfig
                | FlexiblePbkdf2DerivationConfig =
                typeof marker === "string"
                  ? makeDerivationConfig(marker)
                  : DEFAULT_FLEXIBLE_ARGON2D_DERIVATION_CONFIG;
              const { saltLength } = derivationConfig;
              const saltBuffer =
                fixedSalt === "string"
                  ? base64ToArrayBuffer(fixedSalt)
                  : this.randomValuesGetter.get(saltLength);
              return this.flexibleEncryptor.encrypt(
                textToArrayBuffer(keyUtf8),
                clearContents,
                derivationConfig,
                DEFAULT_CBCHMAC_CIPHER_CONFIG,
                { salt: saltBuffer }
              );
            } else {
              throw new Error("Wrong types for local data key");
            }
          },
          failure: () => {
            throw new Error("Failure getting state list");
          },
        })
      )
    );
  }
}
