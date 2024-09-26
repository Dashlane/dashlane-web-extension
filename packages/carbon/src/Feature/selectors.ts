import { State } from "Store";
import { firstValueFrom } from "rxjs";
import { isSuccess } from "@dashlane/framework-types";
import { FeatureFlips } from "@dashlane/framework-contracts";
import { ApplicationModulesAccess } from "@dashlane/communication";
export type FeatureFlipsSelector = () => Promise<FeatureFlips>;
export const makeFeatureFlipsSelector = (
  applicationModulesAccess: ApplicationModulesAccess
): FeatureFlipsSelector => {
  return async () => {
    const { queries } = applicationModulesAccess.createClients().featureFlips;
    const value = await firstValueFrom(queries.userFeatureFlips());
    if (isSuccess(value)) {
      return value.data;
    }
    return {};
  };
};
export type GetHasFeatureSelector = (
  state: State,
  feature: string
) => Promise<boolean>;
export const makeGetHasFeatureSelector = (
  applicationModulesAccess: ApplicationModulesAccess
): GetHasFeatureSelector => {
  return async (_state, feature) => {
    const { queries } = applicationModulesAccess.createClients().featureFlips;
    const value = await firstValueFrom(queries.userFeatureFlips());
    if (isSuccess(value)) {
      return value.data[feature];
    }
  };
};
export interface FeatureFlipsSelectors {
  featureFlipsSelector: FeatureFlipsSelector;
  getHasFeatureSelector: GetHasFeatureSelector;
}
export const makeFeatureFlipsSelectors = (
  applicationModulesAccess: ApplicationModulesAccess
): FeatureFlipsSelectors => ({
  featureFlipsSelector: makeFeatureFlipsSelector(applicationModulesAccess),
  getHasFeatureSelector: makeGetHasFeatureSelector(applicationModulesAccess),
});
