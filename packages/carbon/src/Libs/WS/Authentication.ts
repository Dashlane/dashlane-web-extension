import { _makeRequest } from "Libs/WS/request";
import { PersistData } from "Session/types";
const WSVERSION = 7;
const WSNAME = "authentication";
export interface WSAuthentication {
  registerUki: (params: RegisterUkiParams) => Promise<string>;
  validity: (params: { login: string; uki: string }) => Promise<string>;
}
export const makeWSAuthentication = (): WSAuthentication => {
  return {
    registerUki: (params) => registerUki(params),
    validity: (params) => validity(params),
  };
};
export enum SendTokenStatus {
  ERROR,
  SUCCESS,
  OTP_NEEDED,
  UNKNOWN_USER,
}
export interface RegisterUkiParams {
  devicename?: string;
  recovery?: boolean;
  login: string;
  platform: string;
  temporary: PersistData;
  token?: string;
  otp?: string;
  uki: string;
}
function registerUki(params: RegisterUkiParams) {
  return _makeRequest(WSNAME, WSVERSION, "registeruki", params, {
    responseType: "text",
  }).then((status: string) => {
    throwErrorIfNotString(status);
    if (status === "ERROR") {
      throw new Error(`Error: Failed to register the UKI`);
    }
    return status;
  });
}
function throwErrorIfNotString(status: string) {
  if (typeof status !== "string") {
    const response = JSON.stringify(status);
    throw new Error(`unsupported_response - ${response}`);
  }
}
function validity(params: { login: string; uki: string }): Promise<string> {
  return _makeRequest(WSNAME, WSVERSION, "validity", params, {
    responseType: "text",
  });
}
