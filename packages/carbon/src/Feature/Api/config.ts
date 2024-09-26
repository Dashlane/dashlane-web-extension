import {
  CommandQueryBusConfig,
  NoCommands,
  NoQueries,
} from "Shared/Infrastructure";
import { FeatureQueries } from "Feature/Api/queries";
import { makeFeatureFlipsSelectors } from "Feature/selectors";
import { CoreServices } from "Services";
export const config: CommandQueryBusConfig<
  NoCommands,
  FeatureQueries,
  NoQueries
> = {
  commands: {},
  queries: {
    getHasFeature: {
      selectorFactory: async (services: CoreServices) => {
        const selectors = await makeFeatureFlipsSelectors(
          services.applicationModulesAccess
        );
        return selectors.getHasFeatureSelector;
      },
    },
    getFeatures: {
      selectorFactory: async (services: CoreServices) => {
        const selectors = await makeFeatureFlipsSelectors(
          services.applicationModulesAccess
        );
        return selectors.featureFlipsSelector;
      },
    },
  },
  liveQueries: {},
};
