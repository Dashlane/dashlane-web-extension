import { _makeRequest } from "Libs/WS/request";
import Debugger from "Logs/Debugger";
const WSVERSION = 3;
const WSNAME = "strongauth";
export interface WSStrongAuth {
  checkChangeMasterPassword: (
    params: CheckChangePasswordRequest
  ) => Promise<CheckChangePasswordResponse>;
}
export const makeWSStrongAuth = () => {
  return {
    checkChangeMasterPassword: (params: CheckChangePasswordRequest) =>
      checkChangeMasterPassword(params),
  };
};
export enum CheckChangePasswordStatus {
  Unauthorized,
  OK,
}
export type CheckChangePasswordResponse = {
  status: CheckChangePasswordStatus;
  content?: any;
};
export interface CheckChangePasswordRequest {
  login: string;
  otp: string;
  deviceId: string;
}
function checkChangeMasterPassword({
  login,
  otp,
  deviceId,
}: CheckChangePasswordRequest) {
  return _makeRequest(WSNAME, WSVERSION, "getServerKey", {
    login,
    otp,
    deviceID: deviceId,
    isMxAware: true,
  }).then((response: { message: string; content?: string }) => {
    Debugger.log(
      "checkChangeMasterPassword: " +
        (response ? JSON.stringify(response) : "response null")
    );
    if (!response || !response.message) {
      throw new Error("Unknown response from server");
    }
    if (CheckChangePasswordStatus[response.message] === undefined) {
      throw new Error(`unknown_message - ${JSON.stringify(response)}`);
    }
    return {
      status: CheckChangePasswordStatus[response.message],
      content: response.content,
    };
  });
}
