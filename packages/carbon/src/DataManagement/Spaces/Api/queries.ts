import { PremiumStatusSpaceItemView } from "@dashlane/communication";
import { Query } from "Shared/Api";
export type SpaceQueries = {
  getSpace: Query<string, PremiumStatusSpaceItemView | undefined>;
  getSpaces: Query<void, PremiumStatusSpaceItemView[]>;
};
