import { DropdownItem } from "@dashlane/design-system";
import { useFeatureFlip } from "@dashlane/framework-react";
import { DASHLANE_LABS_FEATURE_FLIP_NAME } from "../../../dashlane-labs/constants";
import {
  redirect,
  useRouterGlobalSettingsContext,
} from "../../../../libs/router";
export const DashlaneLabs = () => {
  const hasDashlaneLabs = useFeatureFlip(DASHLANE_LABS_FEATURE_FLIP_NAME);
  const { routes } = useRouterGlobalSettingsContext();
  const handleOpenDashlaneLabs = (e: Event) => {
    e.preventDefault();
    redirect(routes.dashlaneLabs);
  };
  return hasDashlaneLabs ? (
    <DropdownItem
      data-testid="dashlane-labs-item"
      onSelect={(e) => handleOpenDashlaneLabs(e)}
      label="Dashlane Labs"
      leadingIcon="FeatureAutofillOutlined"
    />
  ) : null;
};
