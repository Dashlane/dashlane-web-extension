import { BreachType } from "@dashlane/communication";
import {
  BreachContent,
  BreachMappers,
  VersionedBreach,
} from "DataManagement/Breaches/types";
import { isDataLeaksBreach } from "DataManagement/Breaches/guards";
function eventDateMapper({ eventDate }: BreachContent): number {
  return Date.parse(eventDate);
}
export function breachTypeMapper(breach: VersionedBreach): BreachType {
  return isDataLeaksBreach(breach) ? "private" : "public";
}
export const getBreachMappers = (): BreachMappers => ({
  breachType: (breach) => breachTypeMapper(breach),
  eventDate: (breach) => eventDateMapper(breach.Content),
  id: (breach) => breach.Id,
  status: (breach) => breach.Status,
});
