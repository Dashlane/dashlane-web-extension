import { _makeRequest } from "Libs/WS/request";
interface NewCardTokenRequest {
  login: string;
  uki: string;
  teamId?: number;
}
interface WSInfo {
  version: number;
  name: string;
}
interface Content {
  customerId: string;
  tokenId: string;
}
export interface NewCardTokenResponse {
  code: number;
  content: Content;
  message: string;
}
export function NewCardToken(
  auth: NewCardTokenRequest,
  wsInfo: WSInfo
): Promise<NewCardTokenResponse> {
  return _makeRequest(wsInfo.name, wsInfo.version, "getNewCardToken", {
    login: auth.login,
    uki: auth.uki,
    teamId: auth.teamId ?? null,
  });
}
