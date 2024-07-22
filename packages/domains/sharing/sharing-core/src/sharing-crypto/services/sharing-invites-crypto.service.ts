import { Injectable } from "@dashlane/framework-application";
import {
  arrayBufferToBase64,
  pemToSpki,
  textToArrayBuffer,
} from "@dashlane/framework-encoding";
import { SharingCryptographyService } from "./sharing-cryptography.service";
import { SignedInvite } from "../../sharing-common";
@Injectable()
export class SharingInvitesCryptoService {
  public constructor(private sharingCrypto: SharingCryptographyService) {}
  public async createSignedInvite(
    recipientIdentity: string,
    resource: {
      resourceKey: ArrayBuffer;
      uuid: string;
    },
    recipientPublicKey: string | null,
    recipientPrivateKey?: string
  ): Promise<SignedInvite> {
    const encryptedUserResourceKeyBufferSpki = recipientPublicKey
      ? await this.sharingCrypto.encryptResourceKey(
          pemToSpki(recipientPublicKey),
          resource.resourceKey
        )
      : undefined;
    const encryptedUserResourceKeyB64 = encryptedUserResourceKeyBufferSpki
      ? arrayBufferToBase64(encryptedUserResourceKeyBufferSpki)
      : undefined;
    const userLoginBuffer = textToArrayBuffer(recipientIdentity);
    const proposeSignatureB64 = await this.sharingCrypto.createProposeSignature(
      resource.resourceKey,
      userLoginBuffer
    );
    const acceptSignatureB64 = recipientPrivateKey
      ? await this.sharingCrypto.createAcceptSignature(
          recipientPrivateKey,
          resource.uuid,
          resource.resourceKey
        )
      : undefined;
    return {
      proposeSignature: proposeSignatureB64,
      acceptSignature: acceptSignatureB64,
      resourceKey: encryptedUserResourceKeyB64,
      proposeSignatureUsingAlias: !recipientPublicKey,
    };
  }
}
