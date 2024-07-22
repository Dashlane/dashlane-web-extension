import { BaseItem } from "./common";
export interface Passkey extends BaseItem {
  counter: number;
  credentialId: string;
  keyAlgorithm: number;
  privateKey: {
    crv: string;
    d: string;
    ext: boolean;
    key_ops: string[];
    kty: string;
    x: string;
    y: string;
  };
  rpId: string;
  rpName: string;
  userDisplayName: string;
  userHandle: string;
  note?: string;
  itemName?: string;
}
