import { _makeRequest } from "Libs/WS/request";
import { ContactInfo } from "@dashlane/communication";
const WSVERSION = 1;
const WSNAME = "contactinfos";
export type ContactInfoResponse = ContactInfo & {
  result?: "success";
};
export interface WSContactInfo {
  getContactInfo: (params: {
    login: string;
    uki: string;
  }) => Promise<ContactInfoResponse>;
}
export const makeWSContactInfo = (): WSContactInfo => {
  return {
    getContactInfo: (params: { login: string; uki: string }) =>
      getContactInfo(params),
  };
};
function getContactInfo(params: { login: string; uki: string }) {
  return _makeRequest(WSNAME, WSVERSION, "get", {
    login: params.login,
    uki: params.uki,
  });
}
