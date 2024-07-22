import { arrayBufferToBase64 } from "@dashlane/framework-encoding";
import { Injectable } from "@dashlane/framework-application";
import { CryptographyToolbox } from "../crypto-utils/cryptography-toolbox.service";
import { base64ToUInt8Array } from "../utils/utils";
const SYMMETRIC_KEY_HEADER = "DASHLANE_D2D_SYMMETRIC_KEY";
const CHECK_SEED_HEADER = "DASHLANE_D2D_SAS_SEED";
interface DeviceTransferPayload {
  login: string;
  key: {
    type: "master_password" | "invisible_master_password" | "sso";
    value: string;
  };
  token: string;
  version: number;
}
@Injectable()
export class DeviceToDeviceCryptoService {
  public constructor(private cryptoToolboxService: CryptographyToolbox) {}
  public verifyUntrustedDevicePublicKey(
    hashedUntrustedDevicePublicKey: string,
    untrustedDevicePublicKey: string
  ): boolean {
    return this.cryptoToolboxService.compare(
      base64ToUInt8Array(hashedUntrustedDevicePublicKey),
      base64ToUInt8Array(this.hash(untrustedDevicePublicKey))
    );
  }
  public generateReceiverSharedSecret(
    localPublicKey: string,
    localPrivateKey: string,
    remotePublicKey: string
  ): string {
    return arrayBufferToBase64(
      this.cryptoToolboxService.generateClientSharedSecret(
        base64ToUInt8Array(localPublicKey),
        base64ToUInt8Array(localPrivateKey),
        base64ToUInt8Array(remotePublicKey)
      ).sharedRx
    );
  }
  public generateSenderSharedSecret(
    localPublicKey: string,
    localPrivateKey: string,
    remotePublicKey: string
  ): string {
    return arrayBufferToBase64(
      this.cryptoToolboxService.generateServerSharedSecret(
        base64ToUInt8Array(localPublicKey),
        base64ToUInt8Array(localPrivateKey),
        base64ToUInt8Array(remotePublicKey)
      ).sharedTx
    );
  }
  public generateSymmetricKey(
    login: string,
    transferId: string,
    sharedSecret: string
  ): string {
    return arrayBufferToBase64(
      this.cryptoToolboxService.hash(
        new TextEncoder().encode(
          `${SYMMETRIC_KEY_HEADER}${login.length}${login}${transferId}`
        ),
        base64ToUInt8Array(sharedSecret)
      )
    );
  }
  public hash(data: string): string {
    return arrayBufferToBase64(
      this.cryptoToolboxService.hash(base64ToUInt8Array(data))
    );
  }
  public generateKeyPair() {
    const keyPair = this.cryptoToolboxService.generateKeyPair();
    return {
      publicKey: arrayBufferToBase64(keyPair.publicKey),
      privateKey: arrayBufferToBase64(keyPair.privateKey),
    };
  }
  public generateVisualCheckSeed(
    login: string,
    transferId: string,
    sharedSecret: string
  ): string {
    return arrayBufferToBase64(
      this.cryptoToolboxService.hash(
        new TextEncoder().encode(
          `${CHECK_SEED_HEADER}${login.length}${login}${transferId}`
        ),
        base64ToUInt8Array(sharedSecret)
      )
    );
  }
  public encryptInvisibleMasterPassword(
    userLogin: string,
    authTicket: string,
    userInvisibleMasterPassword: string,
    transferId: string,
    sharedSecret: string
  ) {
    const makePayload = (payload: DeviceTransferPayload) => {
      return new TextEncoder().encode(JSON.stringify(payload));
    };
    const payload = makePayload({
      login: userLogin,
      key: {
        type: "invisible_master_password",
        value: userInvisibleMasterPassword,
      },
      token: authTicket,
      version: 1,
    });
    const symmetricKey = this.generateSymmetricKey(
      userLogin,
      transferId,
      sharedSecret
    );
    const nonce = this.cryptoToolboxService.generateNonce();
    const encryptedDataArray = this.cryptoToolboxService.encrypt(
      payload,
      nonce,
      base64ToUInt8Array(symmetricKey)
    );
    return {
      encryptedData: arrayBufferToBase64(encryptedDataArray),
      nonce: arrayBufferToBase64(nonce),
    };
  }
  public decryptInvisibleMasterPassword(
    data: string,
    nonce: string,
    symmetricKey: string
  ) {
    const decryptedPayload = this.cryptoToolboxService.decrypt(
      base64ToUInt8Array(data),
      base64ToUInt8Array(nonce),
      base64ToUInt8Array(symmetricKey)
    );
    const decodedPayload = new TextDecoder("utf-8").decode(decryptedPayload);
    return JSON.parse(decodedPayload);
  }
}
