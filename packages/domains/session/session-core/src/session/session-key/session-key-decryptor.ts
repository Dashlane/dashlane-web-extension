import { Injectable } from "@dashlane/framework-application";
import { FlexibleDecryptor } from "@dashlane/framework-dashlane-application";
import {
  base64ToArrayBuffer,
  concatBuffers,
  textToArrayBuffer,
} from "@dashlane/framework-encoding";
import { assertUnreachable } from "@dashlane/framework-types";
import { SessionKey } from "../stores/session-state.types";
@Injectable()
export class SessionKeyDecryptor {
  public constructor(private flexibleDecryptor: FlexibleDecryptor) {}
  public decrypt(
    encryptedLk: ArrayBuffer,
    sessionKey: SessionKey
  ): Promise<ArrayBuffer> {
    const { flexibleDecryptor } = this;
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
    }
    return flexibleDecryptor.decrypt(encryptionKey, encryptedLk);
  }
}
