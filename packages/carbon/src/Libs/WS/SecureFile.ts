import { SecureFileResultErrorCode } from "@dashlane/communication";
import { _makeRequest } from "Libs/WS/request";
const WSVERSION = 1;
const WSNAME = "securefile";
interface WSSecureFileGetDownloadLinkRequest {
  login: string;
  uki: string;
  key: string;
}
interface WSSecureFileGetDownloadLinkResultError {
  code: 400;
}
interface WSSecureFileGetDownloadLinkResultSuccess {
  code: 200;
  content: {
    url: string;
  };
}
export type WSSecureFileGetDownloadLinkResult =
  | WSSecureFileGetDownloadLinkResultSuccess
  | WSSecureFileGetDownloadLinkResultError;
function wsSecureFileGetDownloadLink(
  params: WSSecureFileGetDownloadLinkRequest
): Promise<WSSecureFileGetDownloadLinkResult> {
  return _makeRequest<
    WSSecureFileGetDownloadLinkResult,
    WSSecureFileGetDownloadLinkRequest
  >(WSNAME, WSVERSION, "getDownloadLink", params);
}
interface WSSecureFileDeleteRequest {
  login: string;
  uki: string;
  secureFileInfoId: string;
}
interface WSSecureFileDeleteResultError {
  code: 400;
}
interface WSSecureFileDeleteResultSuccess {
  code: 200;
  content: {
    quota: {
      remaining: number;
      max: number;
    };
  };
}
export type WSSecureFileDeleteResult =
  | WSSecureFileDeleteResultSuccess
  | WSSecureFileDeleteResultError;
function wsSecureFileDelete(
  params: WSSecureFileDeleteRequest
): Promise<WSSecureFileDeleteResult> {
  return _makeRequest<WSSecureFileDeleteResult, WSSecureFileDeleteRequest>(
    WSNAME,
    WSVERSION,
    "delete",
    params
  );
}
interface WSSecureFileGetUploadLinkRequest {
  contentLength: number;
  secureFileInfoId: string;
  login: string;
  uki: string;
}
export interface WSSecureFileGetUploadLinkResultError {
  code: 400 | 401 | 403;
  message: string;
  content?: SecureFileResultErrorCode;
}
export interface WSSecureFileGetUploadLinkResultSuccess {
  code: 200;
  message: "OK";
  content: {
    url: string;
    fields: {
      bucket: string;
      "X-Amz-Algorithm": string;
      "X-Amz-Credential": string;
      "X-Amz-Date": string;
      "X-Amz-Security-Token": string;
      Policy: string;
      "X-Amz-Signature": string;
    };
    key: string;
    quota: {
      remaining: number;
      max: number;
    };
    acl: string;
  };
}
export type WSSecureFileGetUploadLinkResult =
  | WSSecureFileGetUploadLinkResultSuccess
  | WSSecureFileGetUploadLinkResultError;
function wsSecureFileGetUploadLink(
  params: WSSecureFileGetUploadLinkRequest
): Promise<WSSecureFileGetUploadLinkResult> {
  return _makeRequest<
    WSSecureFileGetUploadLinkResult,
    WSSecureFileGetUploadLinkRequest
  >(WSNAME, WSVERSION, "getUploadLink", params);
}
interface WSSecureFileCommitRequest {
  secureFileInfoId: string;
  key: string;
  login: string;
  uki: string;
}
interface WSSecureFileCommitResultSuccess {
  code: 200;
}
interface WSSecureFileCommitResultError {
  code: 400;
}
type WSSecureFileCommitResult =
  | WSSecureFileCommitResultSuccess
  | WSSecureFileCommitResultError;
function wsSecureFileCommit(
  params: WSSecureFileCommitRequest
): Promise<WSSecureFileCommitResult> {
  return _makeRequest<WSSecureFileCommitResult, WSSecureFileCommitRequest>(
    WSNAME,
    WSVERSION,
    "commit",
    params
  );
}
export interface WSSecureFile {
  getDownloadLink: (
    params: WSSecureFileGetDownloadLinkRequest
  ) => Promise<WSSecureFileGetDownloadLinkResult>;
  getUploadLink: (
    params: WSSecureFileGetUploadLinkRequest
  ) => Promise<WSSecureFileGetUploadLinkResult>;
  commit: (
    params: WSSecureFileCommitRequest
  ) => Promise<WSSecureFileCommitResult>;
  delete: (
    params: WSSecureFileDeleteRequest
  ) => Promise<WSSecureFileDeleteResult>;
}
export const makeWSSecureFile = (): WSSecureFile => {
  return {
    getDownloadLink: wsSecureFileGetDownloadLink,
    getUploadLink: wsSecureFileGetUploadLink,
    commit: wsSecureFileCommit,
    delete: wsSecureFileDelete,
  };
};
