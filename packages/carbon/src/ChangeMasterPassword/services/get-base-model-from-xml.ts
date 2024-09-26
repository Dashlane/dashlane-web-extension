import { BaseDataModelObject } from "@dashlane/communication";
import { fixKwType } from "Libs/Backup/BackupCrypt/utils";
import { parseTransactionContentXml } from "Libs/Backup/BackupCrypt/singleTransactions";
import { AnnounceSync } from "Libs/Backup/Probe";
import { fixPersonalSettingTypes } from "Session/Store/personalSettings/fixTypes";
export const getBaseModelFromXml = async (
  announce: AnnounceSync,
  content: string
): Promise<BaseDataModelObject> => {
  const xml = await parseTransactionContentXml(announce, content);
  return fixPersonalSettingTypes.fromTransaction(
    fixKwType(xml)
  ) as BaseDataModelObject;
};
