import * as Common from "./Common";
export interface SecureFileInfo extends Common.BaseDataModelObject {
  CryptoKey: string;
  DownloadKey: string;
  Filename: string;
  LocalSize: number;
  RemoteSize: number;
  Type: string;
  CreationDatetime: number;
  UserModificationDatetime: number;
  Owner: string;
}
export function isSecureFileInfo(
  o: Common.BaseDataModelObject
): o is SecureFileInfo {
  return Boolean(o) && o.kwType === "KWSecureFileInfo";
}
