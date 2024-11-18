import { Injectable } from "@dashlane/framework-application";
import { assertUnreachable } from "@dashlane/framework-types";
import { FlexibleEncryptor } from "@dashlane/framework-dashlane-application";
import { DEFAULT_CBCHMAC_CIPHER_CONFIG } from "@dashlane/framework-services";
import {
  base64ToArrayBuffer,
  concatBuffers,
  textToArrayBuffer,
} from "@dashlane/framework-encoding";
import { SessionKey } from "../stores/session-state.types";
import { CryptoSettings } from "../stores/sessions-crypto-settings.store";
@Injectable()
export class SessionKeyEncryptor {
  public constructor(private flexibleEncryptor: FlexibleEncryptor) {}
  public encrypt(
    clearContents: ArrayBuffer,
    sessionKey: SessionKey,
    settings: CryptoSettings
  ): Promise<ArrayBuffer> {
    const { flexibleEncryptor } = this;
    const { derivation, salt } = settings;
    const { algorithm } = derivation;
    if (algorithm === "noderivation") {
      throw new Error("Session key requires derivation");
    }
    let encryptionKey: ArrayBuffer;
    switch (sessionKey.type) {
      case "sso":
        encryptionKey = base64ToArrayBuffer(sessionKey.ssoKey);
        break;
      case "mp":
        encryptionKey = concatBuffers(
          textToArrayBuffer(sessionKey.masterPassword),
          base64ToArrayBuffer(sessionKey.secondaryKey ?? "")
        );
        break;
      default:
        assertUnreachable(sessionKey);
        break;
    }
    return flexibleEncryptor.encrypt(
      encryptionKey,
      clearContents,
      derivation,
      DEFAULT_CBCHMAC_CIPHER_CONFIG,
      {
        salt: base64ToArrayBuffer(salt),
      }
    );
  }
}
