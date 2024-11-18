import {
  ConvertDashlaneXmlToItemRequest,
  ConvertDashlaneXmlToItemResult,
  ConvertItemToDashlaneXmlRequest,
  ConvertItemToDashlaneXmlResult,
  SaveSharedItemsToVaultRequest,
  ShareItemRequest,
  ShareItemResult,
} from "@dashlane/communication";
import { Command } from "Shared/Api";
export type SharingCommands = {
  convertItemToDashlaneXml: Command<
    ConvertItemToDashlaneXmlRequest,
    ConvertItemToDashlaneXmlResult
  >;
  convertDashlaneXmlToItem: Command<
    ConvertDashlaneXmlToItemRequest,
    ConvertDashlaneXmlToItemResult
  >;
  saveSharedItemsToVault: Command<SaveSharedItemsToVaultRequest, void>;
  shareItem: Command<ShareItemRequest, ShareItemResult>;
};
