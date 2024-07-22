import { Injectable } from "@dashlane/framework-application";
import {
  HmacSigner,
  KeyGeneratorAes256,
  Kwc5Decryptor,
  Kwc5Encryptor,
  RsaDecryptor,
  RsaEncryptor,
  RsaKeyPairGenerator,
  RsaSigner,
  RsaVerifier,
} from "@dashlane/framework-dashlane-application";
import {
  arrayBufferToBase64,
  arrayBufferToText,
  base64ToArrayBuffer,
  pemToPkcs8,
  pemToSpki,
  pkcs8ToPem,
  spkiToPem,
  textToArrayBuffer,
} from "@dashlane/framework-encoding";
import { getSuccess, isFailure } from "@dashlane/framework-types";
import {
  CarbonLegacyClient,
  Credential,
  Note,
  Secret,
} from "@dashlane/communication";
import {
  compressDashlaneXml,
  decompressDashlaneXml,
} from "../../utils/compress-dashlane-xml";
import { getDashlaneXmlFromCarbon } from "../../sharing-carbon-helpers/utils/convert-item-to-dashlane-xml";
@Injectable()
export class SharingCryptographyService {
  public constructor(
    private client: CarbonLegacyClient,
    private hmacSigner: HmacSigner,
    private keyGeneratorAes256: KeyGeneratorAes256,
    private rsaKeyPairGenerator: RsaKeyPairGenerator,
    private kwc5Decryptor: Kwc5Decryptor,
    private kwc5Encryptor: Kwc5Encryptor,
    private rsaDecryptor: RsaDecryptor,
    private rsaEncryptor: RsaEncryptor,
    private rsaSigner: RsaSigner,
    private rsaVerifier: RsaVerifier
  ) {}
  public async createResourceKey(): Promise<ArrayBuffer> {
    const resourceKey = await this.keyGeneratorAes256.generate();
    return resourceKey;
  }
  public async encryptSecureData(
    resourceKey: ArrayBuffer,
    clearData: ArrayBuffer
  ): Promise<ArrayBuffer> {
    const secureData = await this.kwc5Encryptor.encrypt(resourceKey, clearData);
    return secureData;
  }
  public async decryptSecureData(
    resourceKey: ArrayBuffer,
    transportableData: ArrayBuffer
  ): Promise<ArrayBuffer> {
    const clearData = await this.kwc5Decryptor.decrypt(
      resourceKey,
      transportableData
    );
    return clearData;
  }
  public async createProposeSignature(
    resourceKey: ArrayBuffer,
    recipientIdentity: ArrayBuffer
  ): Promise<string> {
    const proposeSignature = await this.hmacSigner.sign(
      resourceKey,
      recipientIdentity
    );
    return arrayBufferToBase64(proposeSignature);
  }
  public async createRecipientKeyPair(recipientKey: ArrayBuffer): Promise<{
    publicKey: string;
    privateKey: string;
  }> {
    const { publicKey, privateKey } = await this.rsaKeyPairGenerator.generate();
    const privateKeyPemBuffer = textToArrayBuffer(pkcs8ToPem(privateKey));
    const encryptedPrivateKeyKwc5 = await this.encryptSecureData(
      recipientKey,
      privateKeyPemBuffer
    );
    const publicKeyPem = spkiToPem(publicKey);
    const encryptedPrivateKeyPemB64 = arrayBufferToBase64(
      encryptedPrivateKeyKwc5
    );
    return { publicKey: publicKeyPem, privateKey: encryptedPrivateKeyPemB64 };
  }
  public async createAcceptSignature(
    recipientPrivateKey: string,
    resourceId: string,
    resourceKey: ArrayBuffer
  ): Promise<string> {
    const resourceKeyB64 = arrayBufferToBase64(resourceKey);
    const contentText = `${resourceId}-accepted-${resourceKeyB64}`;
    const content = textToArrayBuffer(contentText);
    const acceptSignature = await this.rsaSigner.sign(
      pemToPkcs8(recipientPrivateKey),
      content
    );
    return arrayBufferToBase64(acceptSignature);
  }
  public async verifyAcceptSignature(
    recipientPublicKey: string,
    acceptSignature: string,
    resourceId: string,
    resourceKey: ArrayBuffer
  ): Promise<boolean> {
    const resourceKeyB64 = arrayBufferToBase64(resourceKey);
    const contentText = `${resourceId}-accepted-${resourceKeyB64}`;
    const content = textToArrayBuffer(contentText);
    const isValid = await this.rsaVerifier.verify(
      pemToSpki(recipientPublicKey),
      base64ToArrayBuffer(acceptSignature),
      content
    );
    return isValid;
  }
  public async encryptResourceKey(
    recipientPublicKey: ArrayBuffer,
    resourceKey: ArrayBuffer
  ): Promise<ArrayBuffer> {
    const encryptedResourceKey = await this.rsaEncryptor.encrypt(
      recipientPublicKey,
      resourceKey
    );
    return encryptedResourceKey;
  }
  public async decryptResourceKey(
    recipientPrivateKey: ArrayBuffer,
    encryptedResourceKey: ArrayBuffer
  ): Promise<ArrayBuffer> {
    const resourceKey = await this.rsaDecryptor.decrypt(
      recipientPrivateKey,
      encryptedResourceKey
    );
    return resourceKey;
  }
  public async decryptResourceKeyToClearText(
    recipientPrivateKey: string,
    resourcePrivateKey: string,
    encryptedResourceKey: string
  ) {
    const clearKeyBuffer = await this.decryptResourceKey(
      pemToPkcs8(recipientPrivateKey),
      base64ToArrayBuffer(encryptedResourceKey)
    );
    const clearUserGroupPrivateKeyPemBuffer = await this.decryptSecureData(
      clearKeyBuffer,
      base64ToArrayBuffer(resourcePrivateKey)
    );
    return arrayBufferToText(clearUserGroupPrivateKeyPemBuffer);
  }
  public async encryptSharingItem(
    itemResourceKey: ArrayBuffer,
    item: Credential | Note | Secret
  ): Promise<ArrayBuffer> {
    const {
      commands: { carbon },
    } = this.client;
    const xmlCarbonResult = await carbon({
      name: "convertItemToDashlaneXml",
      args: [
        {
          item,
        },
      ],
    });
    const xml = getDashlaneXmlFromCarbon(xmlCarbonResult);
    if (xml === "" || xml === null) {
      throw new Error("Unable to convert item to XML");
    }
    const compressedXml = compressDashlaneXml(xml);
    const encryptedSharingItem = await this.encryptSecureData(
      itemResourceKey,
      compressedXml
    );
    return encryptedSharingItem;
  }
  public async decryptContentAndConvertXMLToVaultItem(
    itemResourceKey: ArrayBuffer,
    encryptedItemContent: string
  ): Promise<Credential | Note | Secret | null> {
    const contentBuffer = base64ToArrayBuffer(encryptedItemContent);
    const contentDecrypted64Buffer = await this.decryptSecureData(
      itemResourceKey,
      contentBuffer
    );
    const decompressedXml = decompressDashlaneXml(contentDecrypted64Buffer);
    const result = await this.client.commands.convertDashlaneXmlToItem({
      xml: decompressedXml,
    });
    if (isFailure(result)) {
      return null;
    }
    const item = getSuccess(result);
    if (!item.success) {
      return null;
    }
    return item.item;
  }
  public async decryptEncapsulatedPrivateKey(
    userPrivateKey: ArrayBuffer,
    encryptedEncapsulatedResourceKey: string,
    encryptedEncapsulatedRecipientPrivateKeyPem: string
  ): Promise<ArrayBuffer> {
    const clearEncapsulatedResourceKey = await this.decryptResourceKey(
      userPrivateKey,
      base64ToArrayBuffer(encryptedEncapsulatedResourceKey)
    );
    const clearEncapsulatedRecipientPrivateKeyPemBuffer =
      await this.decryptSecureData(
        clearEncapsulatedResourceKey,
        base64ToArrayBuffer(encryptedEncapsulatedRecipientPrivateKeyPem)
      );
    const clearEncapsulatedRecipientPrivateKey = pemToPkcs8(
      arrayBufferToText(clearEncapsulatedRecipientPrivateKeyPemBuffer)
    );
    return clearEncapsulatedRecipientPrivateKey;
  }
}
