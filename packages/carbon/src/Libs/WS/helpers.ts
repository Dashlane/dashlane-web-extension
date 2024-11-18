import { WSResponseBase } from "Libs/WS/types";
export function isWSResponseSuccess(response: WSResponseBase): boolean {
  return response.code === 200;
}
