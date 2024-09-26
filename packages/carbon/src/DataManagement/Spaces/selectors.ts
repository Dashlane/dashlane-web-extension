import { PremiumStatusSpaceItemView, Space } from "@dashlane/communication";
import { State } from "Store";
import { getDefaultPersonalSpace } from "DataManagement/Spaces/helpers";
import { listView } from "DataManagement/Spaces/views";
const EMPTY_SPACES_ARRAY: Space[] = [];
export const spacesSelector = (state: State) =>
  state.userSession?.spaceData?.spaces ?? EMPTY_SPACES_ARRAY;
export const activeSpacesSelector = (state: State) =>
  (spacesSelector(state) || []).filter(
    (space) => space.details && space.details.status === "accepted"
  );
export const activeSpacesDetailsSelector = (state: State) =>
  activeSpacesSelector(state).map((space) => space.details);
export const viewedSpacesSelector = (state: State) => {
  const b2bStatus = state.userSession.localSettings.nodePremiumStatus.b2bStatus;
  const isPersonalSpaceDisabled =
    !!b2bStatus &&
    b2bStatus.statusCode === "in_team" &&
    !b2bStatus.currentTeam?.teamInfo.personalSpaceEnabled;
  if (isPersonalSpaceDisabled && activeSpacesDetailsSelector(state).length) {
    return listView([...activeSpacesDetailsSelector(state)]);
  } else {
    return listView([
      ...activeSpacesDetailsSelector(state),
      getDefaultPersonalSpace(),
    ]);
  }
};
export const viewedSpaceSelector = (
  state: State,
  spaceId: string
): PremiumStatusSpaceItemView | undefined =>
  viewedSpacesSelector(state).find((space) => space.spaceId === spaceId);
