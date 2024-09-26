import { slot } from "ts-event-bus";
import { Feature, Features } from "./types";
export const featureQueriesSlots = {
  getHasFeature: slot<Feature, boolean>(),
  getFeatures: slot<void, Features>(),
};
