import {
  ConvertItemToDashlaneXmlRequest,
  ConvertItemToDashlaneXmlResult,
  Credential,
  Note,
  Secret,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { getDashlaneXml } from "Libs/XML";
import { StoreService } from "Store";
export enum ConvertItemToDashlaneXmlErrorCode {
  INVALID_XML = "INVALID_XML",
  NOT_AUTHENTICATED = "NOT_AUTHENTICATED",
}
export async function convertItemToDashlaneXmlHandler(
  services: CoreServices,
  payload: ConvertItemToDashlaneXmlRequest
): Promise<ConvertItemToDashlaneXmlResult> {
  const { storeService } = services;
  const { item } = payload;
  return convertItemToDashlaneXml(storeService, item);
}
export async function convertItemToDashlaneXml(
  storeService: StoreService,
  item: Credential | Note | Secret
): Promise<ConvertItemToDashlaneXmlResult> {
  if (!storeService.isAuthenticated()) {
    return {
      success: false,
      error: {
        code: ConvertItemToDashlaneXmlErrorCode.NOT_AUTHENTICATED,
      },
    };
  }
  const xml = getDashlaneXml(item);
  if (!xml || xml === "") {
    return {
      success: false,
      error: { code: ConvertItemToDashlaneXmlErrorCode.INVALID_XML },
    };
  }
  return { success: true, xml };
}
