import {
  flatten,
  groupBy,
  mapObjIndexed,
  pipe,
  prop,
  sortBy,
  takeLast,
  values,
} from "ramda";
import { BreachLeakedDataType } from "@dashlane/communication";
import { BreachContent } from "DataManagement/Breaches/types";
import {
  BreachEnvStatus,
  VersionedBreach,
} from "DataManagement/Breaches/types";
import { isDataLeaksBreachContent } from "DataManagement/Breaches/guards";
const takeLastOne = takeLast(1);
const takeLastBreachContent = (breaches: BreachContent[]) =>
  takeLastOne(breaches);
export const deduplicateBreachContents: (
  contents: BreachContent[]
) => BreachContent[] = pipe(
  groupBy<BreachContent>(prop("id")),
  mapObjIndexed(sortBy(prop("lastModificationRevision"))),
  mapObjIndexed(takeLastBreachContent),
  values,
  flatten
);
export const findByBreachId = (
  breachId: string,
  breaches: VersionedBreach[]
): VersionedBreach | undefined =>
  breaches.find((breach) => breach.BreachId === breachId);
export const isBreachDeleted = (breachContent: BreachContent) =>
  breachContent.status === BreachEnvStatus.Deleted;
export const hasBreachLeakedDataOfType = (
  breachContent: BreachContent,
  type: BreachLeakedDataType
) =>
  (breachContent.leakedData || []).findIndex(
    (t: BreachLeakedDataType) => type === t
  ) >= 0;
const hasBreachLeakedDataOfTypeAmong = (
  breachContent: BreachContent,
  types: BreachLeakedDataType[]
) =>
  (breachContent.leakedData || []).findIndex((t: BreachLeakedDataType) =>
    types.some((tt) => tt === t)
  ) >= 0;
export const hasBreachLeakedPrivateInfo = (breachContent: BreachContent) =>
  isDataLeaksBreachContent(breachContent) ||
  hasBreachLeakedDataOfTypeAmong(breachContent, [
    BreachLeakedDataType.Email,
    BreachLeakedDataType.Username,
    BreachLeakedDataType.CreditCard,
    BreachLeakedDataType.Phone,
    BreachLeakedDataType.Address,
    BreachLeakedDataType.SSN,
    BreachLeakedDataType.IP,
    BreachLeakedDataType.Location,
    BreachLeakedDataType.PersonalInfo,
    BreachLeakedDataType.SocialNetwork,
  ]);
