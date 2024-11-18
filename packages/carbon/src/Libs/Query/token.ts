import {
  utf8ChunkDecode,
  utf8ChunkEncode,
} from "Libs/CryptoCenter/Helpers/Helper";
import { Token } from "Libs/Pagination/types";
const base64 = require("base-64");
export function parseToken(b64Token: string): any {
  const utf8 = base64.decode(b64Token);
  const json = utf8ChunkDecode(utf8);
  const token = JSON.parse(json);
  return token;
}
export function stringifyToken<S extends string, F extends string>(
  token: Token<S, F> | undefined
): string {
  if (token === undefined) {
    return "";
  }
  const json = JSON.stringify(token);
  const utf8 = utf8ChunkEncode(json);
  const b64 = base64.encode(utf8);
  return b64;
}
