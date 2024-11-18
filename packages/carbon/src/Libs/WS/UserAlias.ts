import { _makeRequest } from "Libs/WS/request";
const WSVERSION = 1;
const WSNAME = "userAlias";
export interface WSUserAlias {
  findUsersByAliases: (findUsers: FindUsersRequest) => Promise<{
    [key: string]: FindUsersResponse;
  }>;
}
export const makeWSUserAlias = () => {
  return {
    findUsersByAliases: (findUsers: FindUsersRequest) =>
      findUsersByAliases(findUsers),
  };
};
export interface WSUserAliasResult {
  code: number;
  message: string;
  content: {
    [key: string]: FindUsersResponse;
  };
}
export interface FindUsersRequest {
  login: string;
  uki: string;
  aliases: string;
}
export interface FindUsersResponse {
  login: string;
  publicKey: string;
}
function findUsersByAliases(findUsers: FindUsersRequest): Promise<{
  [key: string]: FindUsersResponse;
}> {
  return _makeRequest(WSNAME, WSVERSION, "findUsers", {
    login: findUsers.login,
    uki: findUsers.uki,
    aliases: findUsers.aliases,
  }).then((wsUserAliasResult: WSUserAliasResult) => wsUserAliasResult.content);
}
