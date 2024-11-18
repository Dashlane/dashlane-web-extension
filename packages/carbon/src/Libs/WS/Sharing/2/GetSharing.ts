import { GetSharing } from "@dashlane/sharing/types/getSharing";
import { ServerResponse } from "@dashlane/sharing/types/serverResponse";
import { SharingServerResponseWsResult } from "Libs/WS/Sharing/2/types";
import { _makeRequest } from "Libs/WS/request";
const WSVERSION = 2;
const WSNAME = "sharing";
export interface WSSharing {
  get: (
    login: string,
    uki: string,
    getSharingEvent: GetSharing
  ) => Promise<ServerResponse>;
}
export function get(
  login: string,
  uki: string,
  getSharingEvent: GetSharing
): Promise<ServerResponse> {
  const data = {
    login,
    uki,
    action: JSON.stringify(getSharingEvent),
  };
  return _makeRequest(WSNAME, WSVERSION, "get", data).then(
    ({ content }: SharingServerResponseWsResult) => {
      return content;
    }
  );
}
export const makeSharingWS = (): WSSharing => ({
  get: (login: string, uki: string, getSharingEvent: GetSharing) =>
    get(login, uki, getSharingEvent),
});
