import { _makeRequest } from "Libs/WS/request";
import { WSRequestParams, WSResponseBase } from "Libs/WS/types";
const WSNAME = "useractivity";
const WSVERSION = 2;
export interface WSUserActivity {
  create: (params: UserActivityCreateParams) => Promise<WSResponseBase>;
}
export const makeWSUserActivity = (): WSUserActivity => {
  return {
    create,
  };
};
export interface UserActivityCreateParams extends WSRequestParams {
  relativeStart: number;
  relativeEnd: number;
  content: string;
  teamsContent: string;
}
export async function create(
  params: UserActivityCreateParams
): Promise<WSResponseBase> {
  const response = await _makeRequest<WSResponseBase, UserActivityCreateParams>(
    WSNAME,
    WSVERSION,
    "create",
    params
  );
  return response;
}
