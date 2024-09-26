import { GenericStore, Item } from "Shared/Infrastructure/EventStore/types";
import { IconsEvent } from "DataManagement/Icons/EventStore/types";
export interface CarbonEventStore extends GenericStore {
  iconsUpdates: Item<IconsEvent>[];
}
