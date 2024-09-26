import { slot } from "ts-event-bus";
import { PremiumStatusSpaceItemView } from "./types";
export const spacesQueriesSlots = {
  getSpace: slot<string, PremiumStatusSpaceItemView | undefined>(),
  getSpaces: slot<void, PremiumStatusSpaceItemView[]>(),
};
