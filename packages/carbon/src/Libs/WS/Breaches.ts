import { _makeRequest } from "Libs/WS/request";
import { WSResponseBase } from "Libs/WS/types";
const WSNAME = "breaches";
const WSVERSION = 1;
const WSMETHOD = "get";
export interface GetRequest {
  login: string;
  uki: string;
  revision: number;
}
export interface GetResponse extends WSResponseBase {
  content: {
    revision: number;
    filesToDownload: string[];
    latest: Array<{
      id: string;
      breachModelVersion: number;
      name: string;
      domains: string[];
      eventDate: string;
      announcedDate?: string;
      leakedData?: string[];
      criticality?: "info" | "warning" | "error";
      restrictiedArea?: string[];
      status?: "legacy" | "live" | "*****" | "deleted";
      sensitiveDomain?: boolean;
      relatedLinks?: {
        en: string;
      };
      description?: string;
      template?: string;
      lastModificationRevision: number;
      breachCreationDate?: number;
    }>;
  };
}
export interface WSBreaches {
  get: (request: GetRequest) => Promise<GetResponse>;
}
export const makeWSBreaches = (): WSBreaches => ({
  get: (r: GetRequest) => _makeRequest(WSNAME, WSVERSION, WSMETHOD, r),
});
