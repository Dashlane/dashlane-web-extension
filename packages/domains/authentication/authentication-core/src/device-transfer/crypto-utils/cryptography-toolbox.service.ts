import _libsodium from "libsodium-wrappers";
import { AsyncProvider, Injectable } from "@dashlane/framework-application";
export type SharedSecret = _libsodium.CryptoKX;
@Injectable()
export class CryptographyToolbox {
  constructor(private readonly sodium: typeof _libsodium) {}
  public generateNonce(): Uint8Array {
    return this.sodium.randombytes_buf(this.sodium.crypto_box_NONCEBYTES);
  }
  public generateKeyPair() {
    return this.sodium.crypto_kx_keypair();
  }
  public hash(data: Uint8Array, key?: string | Uint8Array | null | undefined) {
    return this.sodium.crypto_generichash(
      this.sodium.crypto_secretbox_KEYBYTES,
      data,
      key
    );
  }
  public compare(data1: Uint8Array, data2: Uint8Array) {
    return this.sodium.memcmp(data1, data2);
  }
  public generateClientSharedSecret(
    localPublicKey: Uint8Array,
    localPrivateKey: Uint8Array,
    remotePublicKey: Uint8Array
  ) {
    return this.sodium.crypto_kx_client_session_keys(
      localPublicKey,
      localPrivateKey,
      remotePublicKey
    );
  }
  public generateServerSharedSecret(
    localPublicKey: Uint8Array,
    localPrivateKey: Uint8Array,
    remotePublicKey: Uint8Array
  ) {
    return this.sodium.crypto_kx_server_session_keys(
      localPublicKey,
      localPrivateKey,
      remotePublicKey
    );
  }
  public encrypt(
    data: string | Uint8Array,
    nonce: Uint8Array,
    key: Uint8Array
  ) {
    return this.sodium.crypto_secretbox_easy(data, nonce, key);
  }
  public decrypt(
    data: string | Uint8Array,
    nonce: Uint8Array,
    key: Uint8Array
  ) {
    return this.sodium.crypto_secretbox_open_easy(data, nonce, key);
  }
}
export function getCryptographyToolboxProvider(): AsyncProvider {
  return {
    token: CryptographyToolbox,
    asyncFactory: async () => {
      await _libsodium.ready;
      const libsodiumInstance = _libsodium;
      const toolbox = new CryptographyToolbox(libsodiumInstance);
      return toolbox;
    },
  };
}
