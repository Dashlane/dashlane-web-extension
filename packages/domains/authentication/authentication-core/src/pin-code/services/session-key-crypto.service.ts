import { Injectable } from "@dashlane/framework-application";
import {
  FlexibleDecryptor,
  FlexibleEncryptor,
} from "@dashlane/framework-dashlane-application";
import {
  DEFAULT_CBCHMAC64_CIPHER_CONFIG,
  DEFAULT_NODERIVATION_CONFIG,
} from "@dashlane/framework-services";
@Injectable()
export class SessionKeyCrypto {
  constructor(
    private readonly flexibleEncryptor: FlexibleEncryptor,
    private readonly flexibleDecryptor: FlexibleDecryptor
  ) {}
  public async encryptSessionKeyWithPinKey(
    sessionKeyBuffer: ArrayBuffer,
    pinKeyBuffer: ArrayBuffer
  ): Promise<ArrayBuffer> {
    return await this.flexibleEncryptor.encrypt(
      pinKeyBuffer,
      sessionKeyBuffer,
      DEFAULT_NODERIVATION_CONFIG,
      DEFAULT_CBCHMAC64_CIPHER_CONFIG
    );
  }
  public async decryptSessionKeyWithPinKey(
    encryptedSessionKeyBuffer: ArrayBuffer,
    pinKeyBuffer: ArrayBuffer
  ): Promise<ArrayBuffer> {
    return await this.flexibleDecryptor.decrypt(
      pinKeyBuffer,
      encryptedSessionKeyBuffer
    );
  }
}
