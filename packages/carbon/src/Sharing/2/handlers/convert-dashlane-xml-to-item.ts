import {
  ConvertDashlaneXmlToItemRequest,
  ConvertDashlaneXmlToItemResult,
  isCredential,
  isNote,
} from "@dashlane/communication";
import { CoreServices } from "Services";
import { parseDashlaneXml } from "Libs/XML";
import {
  fixCredentialTypesFromTransaction,
  fixNoteTypesFromTransaction,
} from "Session/Store/personalData/normalizeData/fixTypes";
export enum ConvertDashlaneXmlToErrorCode {
  INVALID_XML = "INVALID_XML",
  NOT_AUTHENTICATED = "NOT_AUTHENTICATED",
}
export async function convertDashlaneXmlToItem(
  services: CoreServices,
  payload: ConvertDashlaneXmlToItemRequest
): Promise<ConvertDashlaneXmlToItemResult> {
  const { storeService } = services;
  if (!storeService.isAuthenticated()) {
    return {
      success: false,
      error: {
        code: ConvertDashlaneXmlToErrorCode.NOT_AUTHENTICATED,
      },
    };
  }
  const { xml } = payload;
  if (!xml || xml === "") {
    return {
      success: false,
      error: { code: ConvertDashlaneXmlToErrorCode.INVALID_XML },
    };
  }
  const { __type__, ...item } = (await parseDashlaneXml(xml)) as any;
  let kwFixedItem = {
    ...item,
    kwType: item.kwType || __type__,
  };
  if (isCredential(kwFixedItem)) {
    kwFixedItem = fixCredentialTypesFromTransaction(kwFixedItem);
  } else if (isNote(kwFixedItem)) {
    kwFixedItem = fixNoteTypesFromTransaction(kwFixedItem);
  }
  return { success: true, item: kwFixedItem };
}
