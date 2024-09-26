import * as R from "ramda";
export interface MakeCanonicalRequestParams {
  method: string;
  uri: string;
  query: {
    [index: string]: string | string[];
  };
  headers: {
    [index: string]: string;
  };
  hashedPayload: string;
  headersToSign?: string[];
}
export interface MakeCanonicalRequestResponse {
  canonicalRequest: string;
  signedHeaders: string;
}
export const makeCanonicalRequest = (
  params: MakeCanonicalRequestParams
): MakeCanonicalRequestResponse => {
  const toLowerCase = (header: string) => header.toLowerCase();
  const headers = convertDictionaryToLowerCaseKeys(params.headers);
  const headersToSign = params.headersToSign
    ? R.pick(
        R.map(toLowerCase, R.values(params.headersToSign)),
        R.mapObjIndexed(toLowerCase, headers)
      )
    : headers;
  const canonicalURI = makeCanonicalURI(params.uri);
  const canonicalQueryString = makeCanonicalQueryString(params.query);
  const canonicalHeaders = makeCanonicalHeaders(headersToSign);
  const signedHeaders = makeSignedHeaderList(headersToSign);
  const canonicalRequest = [
    params.method,
    canonicalURI,
    canonicalQueryString,
    canonicalHeaders,
    signedHeaders,
    params.hashedPayload,
  ].join("\n");
  return {
    canonicalRequest,
    signedHeaders,
  };
};
const convertDictionaryToLowerCaseKeys = (
  obj: R.Dictionary<string>
): R.Dictionary<string> => {
  return R.pipe(
    R.toPairs,
    R.map(([key, value]: [string, string]) => [key.toLowerCase(), value]),
    toObject
  )(obj);
};
const encodeURIFull = (uri: string): string => {
  return uri
    .split("/")
    .map((uriPart) => encodeURIComponentFull(uriPart))
    .join("/");
};
const encodeURIComponentFull = (part: string): string => {
  return part.replace(
    /[^A-Za-z0-9_.~\-]/g,
    (ch: string) => "%" + ch.charCodeAt(0).toString(16).toUpperCase()
  );
};
const makeCanonicalURI = (uri: string) => {
  return encodeURIFull(uri);
};
const makeCanonicalQueryStringPair = (
  key: string,
  valueOrValues: string | string[]
): string[][] => {
  const encodedKey = encodeURIComponentFull(key);
  const values = Array.isArray(valueOrValues) ? valueOrValues : [valueOrValues];
  const encodeURIComponentFullMapper = (value: string) =>
    encodeURIComponentFull(value);
  const encodedValueMapper = (encodedValue: string): [string, string] => [
    encodedKey,
    encodedValue,
  ];
  const encodePairs = R.pipe(
    R.map(encodeURIComponentFullMapper),
    R.map(encodedValueMapper),
    R.sortBy(R.reduce(R.concat, ""))
  );
  return encodePairs(values);
};
const makeCanonicalQueryString = (
  queryString: R.Dictionary<string | string[]>
) => {
  const makeCanonicalQueryStringPairMapper = ([key, valueOrValues]: [
    string,
    string | string[]
  ]) => makeCanonicalQueryStringPair(key, valueOrValues);
  return R.pipe(
    (h: R.Dictionary<string | string[]>) => R.toPairs(h),
    R.sortBy((pair) => pair[0]),
    R.map(makeCanonicalQueryStringPairMapper),
    R.unnest,
    R.map(([key, value]) => `${key}=${value}`),
    R.join("&")
  )(queryString);
};
const makeCanonicalHeaders = (headersToSign: R.Dictionary<string>) => {
  const makeCanonicalHeaderPair = (key: string, value: string) => {
    return key.toLowerCase() + ":" + value.trim().replace(/\s+/g, " ") + "\n";
  };
  const encodePairs = R.pipe(
    (h: R.Dictionary<string>) => R.toPairs(h),
    R.sortBy((headerPair) => headerPair[0].toLowerCase()),
    R.map(([key, value]) => makeCanonicalHeaderPair(key, value)),
    R.join("")
  );
  return encodePairs(headersToSign);
};
const makeSignedHeaderList = (headersToSign: R.Dictionary<string>) => {
  return R.pipe(
    R.keys,
    R.map((header: string) => header.toLowerCase()),
    R.sortBy(R.identity),
    R.join(";")
  )(headersToSign);
};
const toObject = (arr: [string, string][]) => {
  const rv = {};
  for (let i = 0; i < arr.length; ++i) {
    rv[arr[i][0]] = arr[i][1];
  }
  return rv;
};
