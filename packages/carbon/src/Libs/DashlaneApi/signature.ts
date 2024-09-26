import { compose, composeP } from "ramda";
import { computeHashSha256 } from "Libs/CryptoCenter/Primitives/Hash";
import {
  convertBufferToHex,
  str2ab,
  utf8ChunkEncode,
} from "Libs/CryptoCenter/Helpers/Helper";
import { signHashHmacSHA256 } from "Libs/CryptoCenter/Primitives/SymmetricEncryption";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
import { ApiAuthType } from "Libs/DashlaneApi/types";
import {
  AppCredentials,
  DeviceCredentials,
  SessionCredentials,
  TeamDeviceCredentials,
} from "Libs/DashlaneApi/credentials";
import { makeCanonicalRequest } from "Libs/DashlaneApi/canonicalization";
import { assertUnreachable } from "Helpers/assert-unreachable";
export const signatureAlgorithm = "DL1-HMAC-SHA256";
export const allowedUnsignedClientHeaders = [
  "origin",
  "content-length",
  "content-encoding",
  "authorization",
  "user-agent",
  "accept-encoding",
];
export const allowedUnsignedProxyHeaders = ["*****", "*****", "*****", "*****"];
export const allowedUnsignedHeaders = [
  ...allowedUnsignedClientHeaders,
  ...allowedUnsignedProxyHeaders,
];
export interface RequestToSign {
  rawBody: string;
  headers: {
    [index: string]: string;
  };
  method: "GET" | "POST";
  pathname: string;
  query?: {
    [index: string]: string | string[];
  };
}
export type SigningCredentials =
  | AppCredentials
  | DeviceCredentials
  | SessionCredentials
  | TeamDeviceCredentials;
export interface SignRequestParams {
  request: RequestToSign;
  credentials: SigningCredentials;
  timestamp?: number;
  headersToSign?: string[];
}
export const signRequest = async (
  params: SignRequestParams
): Promise<string> => {
  const {
    request,
    credentials,
    headersToSign,
    timestamp = getUnixTimestamp(),
  } = params;
  const { method, pathname: uri, headers, query = {}, rawBody } = request;
  const then = <T>(p: T) => Promise.resolve(p);
  const utfStrToBuffer = compose(str2ab, utf8ChunkEncode);
  const hashUtfString = composeP(
    compose(then, convertBufferToHex),
    computeHashSha256,
    compose(then, utfStrToBuffer)
  );
  const hashedPayload = await hashUtfString(rawBody);
  const { canonicalRequest, signedHeaders } = makeCanonicalRequest({
    method,
    uri,
    headers,
    query,
    hashedPayload,
    headersToSign,
  });
  const hashedCanonicalRequest = await hashUtfString(canonicalRequest);
  const stringToSign = [
    signatureAlgorithm,
    timestamp,
    hashedCanonicalRequest,
  ].join("\n");
  const secretKey = getSecretKey(credentials);
  const dataToSignBuffer = utfStrToBuffer(stringToSign);
  const signatureBuffer = await signHashHmacSHA256({
    key: str2ab(secretKey),
    data: dataToSignBuffer,
  });
  const signature = convertBufferToHex(signatureBuffer);
  const authorizationHeader =
    signatureAlgorithm +
    " " +
    [
      ...getHeaderParams(credentials),
      `Timestamp=${timestamp}`,
      `SignedHeaders=${signedHeaders}`,
      `Signature=${signature}`,
    ].join(",");
  return authorizationHeader;
};
function getHeaderParams(credentials: SigningCredentials): Array<string> {
  const { appKeys } = credentials;
  const appParams = ["AppAccessKey=" + appKeys.accessKey];
  switch (credentials.type) {
    case ApiAuthType.App:
      return appParams;
    case ApiAuthType.UserDevice: {
      const { login, deviceKeys } = credentials;
      return [
        `Login=${login}`,
        ...appParams,
        `DeviceAccessKey=${deviceKeys.accessKey}`,
      ];
    }
    case ApiAuthType.Session: {
      const { deviceId, login, sessionKeys } = credentials;
      return [
        `Login=${login}`,
        ...appParams,
        `SessionAccessKey=${sessionKeys.accessKey}`,
        `DeviceAccessKey=${deviceId}`,
      ];
    }
    case ApiAuthType.TeamDevice: {
      const { teamUuid, deviceKeys } = credentials;
      return [
        `TeamUuid=${teamUuid}`,
        ...appParams,
        `DeviceAccessKey=${deviceKeys.accessKey}`,
      ];
    }
    default:
      assertUnreachable(credentials);
  }
}
function getSecretKey(credentials: SigningCredentials): string {
  const { appKeys } = credentials;
  switch (credentials.type) {
    case ApiAuthType.App:
      return appKeys.secretKey;
    case ApiAuthType.UserDevice: {
      const { deviceKeys } = credentials;
      return `${appKeys.secretKey}\n${deviceKeys.secretKey}`;
    }
    case ApiAuthType.Session: {
      const { sessionKeys } = credentials;
      return `${appKeys.secretKey}\n${sessionKeys.secretKey}`;
    }
    case ApiAuthType.TeamDevice: {
      const { deviceKeys } = credentials;
      return `${appKeys.secretKey}\n${deviceKeys.secretKey}`;
    }
    default:
      assertUnreachable(credentials);
  }
}
