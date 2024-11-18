import * as Common from "./Common";
export enum WebAuthnKeyAlgorithm {
  CloudPasskey = -65537,
  ES256 = -7,
}
export type WebAuthnPrivateKey = {
  crv: string;
  d: string;
  ext: boolean;
  key_ops: string[];
  kty: string;
  x: string;
  y: string;
};
export type WebAuthnCloudCipheringKey = {
  uuid: string;
  key: string;
};
interface WebAuthnBaseObject {
  Counter: number;
  CredentialId: string;
  KeyAlgorithm: number;
  RpId: string;
  RpName: string;
  UserDisplayName: string;
  UserHandle: string;
}
export interface WebAuthnCloudPasskeyObject extends WebAuthnBaseObject {
  KeyAlgorithm: WebAuthnKeyAlgorithm.CloudPasskey;
  CloudCipheringKey: WebAuthnCloudCipheringKey;
}
export interface WebAuthnLegacyPasskeyObject extends WebAuthnBaseObject {
  KeyAlgorithm: WebAuthnKeyAlgorithm.ES256;
  PrivateKey: WebAuthnPrivateKey;
}
export type WebAuthnObject =
  | WebAuthnCloudPasskeyObject
  | WebAuthnLegacyPasskeyObject;
interface BasePasskey extends Common.DataModelObject {
  ItemName: string;
  Note: string;
}
export type Passkey = CloudPasskey | LegacyPasskey;
export function isPasskey(o: Common.BaseDataModelObject): o is Passkey {
  return Boolean(o) && o.kwType === "KWPasskey";
}
export type CloudPasskey = BasePasskey & WebAuthnCloudPasskeyObject;
export function isCloudPasskey(
  o: Common.BaseDataModelObject
): o is CloudPasskey {
  return isPasskey(o) && o.KeyAlgorithm === WebAuthnKeyAlgorithm.CloudPasskey;
}
export type LegacyPasskey = BasePasskey & WebAuthnLegacyPasskeyObject;
export function isLegacyPasskey(
  o: Common.BaseDataModelObject
): o is LegacyPasskey {
  return isPasskey(o) && o.KeyAlgorithm === WebAuthnKeyAlgorithm.ES256;
}
