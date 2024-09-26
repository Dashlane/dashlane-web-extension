import { is } from "ramda";
import {
  IncomingDataLeakBreachDetails,
  IncomingDataLeakPasswordInfo,
} from "DataManagement/Breaches/Gateways/types";
export const isIncomingDataLeakBreachDetails = (
  json: unknown
): json is IncomingDataLeakBreachDetails =>
  is(Object, json) &&
  typeof json["breachId"] === "string" &&
  json["breachId"] !== "" &&
  Array.isArray(json["data"]);
export const isIncomingDataLeakPasswordInfo = (
  json: unknown
): json is IncomingDataLeakPasswordInfo =>
  is(Object, json) &&
  json["type"] === "password" &&
  json["hashMethod"] === "plaintext" &&
  typeof json["value"] === "string" &&
  json["value"] !== "";
