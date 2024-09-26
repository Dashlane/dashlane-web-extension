import { KWXmlDataElement } from "@dashlane/kw-xml";
import { BaseDataModelObject, isCollection } from "@dashlane/communication";
import { fixKwType } from "Libs/Backup/BackupCrypt/utils";
import { fixPersonalDataItemFromExternalSource } from "Session/Store/personalData/normalizeData/index";
import { deflatedUtf8ToUtf16 } from "Libs/CryptoCenter";
import { makeDataEncryptorService } from "Libs/CryptoCenter/DataEncryptorService";
import { parseDashlaneXml } from "Libs/XML";
import { logError } from "Logs/Debugger";
import { sendExceptionLog } from "Logs/Exception";
import { StoreService } from "Store";
import { generateItemUuid } from "Utils/generateItemUuid";
export interface DashFile {
  ids: string[];
  encryptedData: string;
}
const NO_SERVER_KEY = "";
const makeSeparatorRegexp = (separator: string) =>
  new RegExp(`-+\\s+${separator} BEGIN\\s+-+\n(.+)\n-+\\s+${separator} END`);
export const parseDashData = (content: string): DashFile => {
  const [idString, contentString] = ["Id", "Data"]
    .map(makeSeparatorRegexp)
    .map((separator) => separator.exec(content))
    .map((match) => match?.[1]);
  return {
    ids: idString?.split(";") ?? [],
    encryptedData: contentString ?? "",
  };
};
export const checkPassword = async (
  storeService: StoreService,
  data: DashFile,
  password: string
): Promise<boolean> => {
  const encryptorService = makeDataEncryptorService(storeService);
  encryptorService.setInstance({ raw: password }, NO_SERVER_KEY);
  try {
    deflatedUtf8ToUtf16(
      await encryptorService.getInstance().decrypt(data.encryptedData)
    );
    return true;
  } catch (e) {
    const message = `[import] - checkPassword: ${e}, ${data.encryptedData}`;
    const augmentedError = new Error(message);
    sendExceptionLog({ error: augmentedError });
    logError(augmentedError);
  }
  return false;
};
export const getXmlData = async (
  storeService: StoreService,
  data: DashFile,
  password: string
): Promise<KWXmlDataElement[]> => {
  const encryptorService = makeDataEncryptorService(storeService);
  encryptorService.setInstance({ raw: password }, NO_SERVER_KEY);
  const decrypted = await encryptorService
    .getInstance()
    .decrypt(data.encryptedData);
  const xmlString = deflatedUtf8ToUtf16(decrypted);
  const xmlData = await parseDashlaneXml(xmlString);
  if (Array.isArray(xmlData)) {
    return xmlData;
  }
  return [xmlData as KWXmlDataElement];
};
export const getSaveEventsFromDash = async (
  storeService: StoreService,
  data: DashFile,
  password: string
): Promise<BaseDataModelObject[]> => {
  const oldToNewIds = {};
  const baseDataModelObjects = (await getXmlData(storeService, data, password))
    .map((d) =>
      fixPersonalDataItemFromExternalSource(
        fixKwType(d as object) as BaseDataModelObject
      )
    )
    .map((vaultItem) => {
      const newId = generateItemUuid();
      oldToNewIds[vaultItem.Id] = newId;
      return { ...vaultItem, Id: newId };
    });
  baseDataModelObjects.forEach((item) => {
    if (isCollection(item)) {
      item.VaultItems.forEach((vaultItem) => {
        vaultItem.Id = oldToNewIds[vaultItem.Id] ?? vaultItem.Id;
      });
    }
  });
  return baseDataModelObjects;
};
