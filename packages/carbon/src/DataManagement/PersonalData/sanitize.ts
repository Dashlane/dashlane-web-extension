import { mapObjIndexed } from "ramda";
const XML_INVALID_CHARS_REGEX_STRING =
  "([^" +
  "\x09" +
  "\x0A" +
  "\x0D" +
  "\x20-\uD7FF\uE000-\uFFFD\u{10000}-\u{10FFFF}" +
  "])";
const removeXmlInvalidChars = (value: unknown) =>
  typeof value === "string"
    ? value.replace(new RegExp(XML_INVALID_CHARS_REGEX_STRING, "gu"), "")
    : value;
export const sanitizeInputPersonalData = <T>(item: T): T =>
  mapObjIndexed(removeXmlInvalidChars, item) as T;
