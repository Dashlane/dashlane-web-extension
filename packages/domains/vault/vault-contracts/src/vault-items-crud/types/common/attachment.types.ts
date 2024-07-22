export interface EmbeddedAttachment {
  id: string;
  type: string;
  version: number;
  filename: string;
  downloadKey: string;
  cryptoKey: string;
  localSize: number;
  remoteSize: number;
  creationDatetime: number;
  userModificationDatetime: number;
  owner: string;
}
