import { BaseDataModelObject } from "@dashlane/communication";
import { join, pluck } from "ramda";
import { utf16ToDeflatedUtf8 } from "Libs/CryptoCenter";
import { CryptoCenterService } from "Libs/CryptoCenter/types";
import { getDashlaneXml } from "Libs/XML";
export async function getDashlaneSecureExport(
  cryptoCenter: CryptoCenterService,
  data: BaseDataModelObject[]
): Promise<string> {
  const idsList = join(";", pluck("Id", data));
  data.forEach((dataModel) => {
    delete dataModel["Attachments"];
  });
  const xmlData = getDashlaneXml(data);
  const bytes = utf16ToDeflatedUtf8(xmlData);
  const encryptedData = await cryptoCenter.encrypt(bytes);
  return join("\n", [
    "-------------------- Dashlane Secured Export ----------------------",
    "--------------------        Id BEGIN         ----------------------",
    idsList,
    "--------------------         Id END          ----------------------",
    "--------------------       Data BEGIN        ----------------------",
    encryptedData,
    "--------------------        Data END         ----------------------",
    "--------------------       Files BEGIN       ----------------------",
    "--------------------        Files END        ----------------------\n",
  ]);
}
