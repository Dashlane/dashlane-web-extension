import { Feature, Features } from "@dashlane/communication";
import { Query } from "Shared/Api";
export type FeatureQueries = {
  getHasFeature: Query<Feature, boolean>;
  getFeatures: Query<void, Features>;
};
