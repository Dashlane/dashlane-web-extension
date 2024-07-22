import * as React from "react";
import { FeatureFlips } from "../communication/types";
interface State {
  features: FeatureFlips;
  hasFeature: (key: string) => boolean;
}
export const FeatureFlipContext = React.createContext<State>({
  features: {},
  hasFeature: () => false,
});
export const FeatureFlipContextProvider = ({
  children,
  featureFlips,
}: {
  children: React.ReactNode;
  featureFlips?: FeatureFlips;
}) => {
  const features = featureFlips || {};
  const state: State = {
    features,
    hasFeature: (key: string) => {
      return features ? Boolean(features[key]) : false;
    },
  };
  return (
    <FeatureFlipContext.Provider value={state}>
      {children}
    </FeatureFlipContext.Provider>
  );
};
