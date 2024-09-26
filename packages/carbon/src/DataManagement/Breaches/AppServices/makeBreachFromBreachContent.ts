import { DataModelType } from "@dashlane/communication";
import { generateItemUuid } from "Utils/generateItemUuid";
import {
  Breach,
  BreachContent,
  BreachStatus,
} from "DataManagement/Breaches/types";
export const makeBreachFromContent = (
  content: BreachContent,
  leakedPasswords: string[]
): Breach => ({
  kwType: DataModelType.KWSecurityBreach,
  LastBackupTime: 0,
  Id: generateItemUuid(),
  BreachId: content.id,
  Content: content,
  ContentRevision: content.lastModificationRevision,
  Status: BreachStatus.PENDING,
  LeakedPasswords: leakedPasswords,
});
