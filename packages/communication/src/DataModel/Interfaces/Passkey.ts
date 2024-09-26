import * as Common from "./Common";
export type WebAuthnPrivateKey = {
  crv: string;
  d: string;
  ext: boolean;
  key_ops: string[];
  kty: string;
  x: string;
  y: string;
};
export interface WebAuthnObject {
  Counter: number;
  CredentialId: string;
  KeyAlgorithm: number;
  PrivateKey: WebAuthnPrivateKey;
  RpId: string;
  RpName: string;
  UserDisplayName: string;
  UserHandle: string;
}
export interface Passkey extends Common.DataModelObject, WebAuthnObject {
  ItemName: string;
  Note: string;
}
export function isPasskey(o: Common.BaseDataModelObject): o is Passkey {
  return Boolean(o) && o.kwType === "KWPasskey";
}
