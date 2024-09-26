import { Optional } from "utility-types";
import { DataModelType, GeneratedPassword } from "@dashlane/communication";
import { generateItemUuid } from "Utils/generateItemUuid";
import { getUnixTimestamp } from "Utils/getUnixTimestamp";
export const createGeneratedPassword = ({
  Id = generateItemUuid(),
  LastBackupTime = 0,
  AuthId,
  Domain,
  GeneratedDate = getUnixTimestamp(),
  Password,
  SpaceId,
  Platform,
}: Optional<
  Omit<GeneratedPassword, "kwType">,
  "Id" | "LastBackupTime" | "GeneratedDate"
>): GeneratedPassword => ({
  kwType: DataModelType.KWGeneratedPassword,
  AuthId,
  Domain,
  GeneratedDate,
  Id,
  SpaceId,
  Password,
  LastBackupTime,
  Platform,
});
