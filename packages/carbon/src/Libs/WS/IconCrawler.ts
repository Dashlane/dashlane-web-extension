import { IconDataStructure, IconType } from "@dashlane/communication";
import { _makeRequest } from "Libs/WS/request";
import { WSResponseBase } from "Libs/WS/types";
const WSVERSION = 2;
const WSNAME = "iconcrawler";
export interface DomainInfo {
  domain: string;
  type: IconType;
}
export type IconDataWithDomain = IconDataStructure & {
  domain: string;
};
export interface DomainIcon {
  date?: number;
  type?: IconType;
  url?: string;
  backgroundColor?: string;
  mainColor?: string;
  domain?: string;
}
interface WSGetIconsResult extends WSResponseBase {
  content: DomainIcon[];
  message: string;
  status: string;
}
export interface WSIconCrawler {
  getIcons: (domainsInfo: DomainInfo[]) => Promise<WSGetIconsResult>;
}
export const makeWSIconCrawler = (): WSIconCrawler => {
  return {
    getIcons: wsGetIcons,
  };
};
const wsGetIcons = async (
  domainsInfo: DomainInfo[]
): Promise<WSGetIconsResult> => {
  return _makeRequest(WSNAME, WSVERSION, "getIcons", { domainsInfo });
};
