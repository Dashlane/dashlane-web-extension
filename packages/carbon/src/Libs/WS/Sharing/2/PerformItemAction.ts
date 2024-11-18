import { _makeRequest } from "Libs/WS/request";
import { UpdateItem as UpdateItemEvent } from "@dashlane/sharing/types/updateItem";
import { ServerResponse } from "@dashlane/sharing/types/serverResponse";
const WSVERSION = 2;
const WSNAME = "sharing";
const WSPATH = "performItemGroupAction";
export interface WSItem {
  updateItem: (
    login: string,
    uki: string,
    updateItemEvent: UpdateItemEvent
  ) => Promise<ServerResponse>;
}
interface ItemServerResponseWsResult {
  code: number;
  message: string;
  content: ServerResponse;
}
function makeRequest<ItemAction extends Object>(
  login: string,
  uki: string,
  itemAction: ItemAction
): Promise<ServerResponse> {
  const data = {
    login,
    uki,
    action: JSON.stringify(itemAction),
  };
  return _makeRequest(WSNAME, WSVERSION, WSPATH, data).then(
    (result: ItemServerResponseWsResult) => {
      const content = result.content;
      const itemErrors = content.itemErrors;
      if (itemErrors && itemErrors.length > 0) {
        throw new Error(itemErrors[0].message);
      }
      return content;
    }
  );
}
export const makeItemWS = (): WSItem => ({
  updateItem: (login, uki, updateItemEvent) => {
    return makeRequest(login, uki, updateItemEvent);
  },
});
