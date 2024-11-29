import { Feature } from "@dashlane/communication";
import { DataStatus } from "@dashlane/carbon-api-consumers";
import { useFeatureFlips } from "@dashlane/framework-react";
export interface FeatureFlipSwitchProps {
  featureFlips: Feature[];
  legacy?: JSX.Element | null;
  children?: JSX.Element | null;
  loadingElement?: JSX.Element | null;
}
export const FeatureFlipContainer = ({
  featureFlips,
  legacy = null,
  loadingElement = null,
  children,
}: FeatureFlipSwitchProps): JSX.Element | null => {
  const features = useFeatureFlips();
  if (features.status !== DataStatus.Success) {
    return loadingElement;
  }
  if (
    !features.data ||
    !featureFlips.some((feature) => features.data[feature])
  ) {
    return legacy;
  }
  return children ?? null;
};
