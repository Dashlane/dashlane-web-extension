import { PremiumStatusSpace, Space } from "@dashlane/communication";
import { spaceDataUpdated } from "Session/Store/spaceData/actions";
import { reportDataUpdate } from "Session/SessionCommunication";
import { StoreService } from "Store/index";
export function refreshSpaceData(
  storeService: StoreService,
  premiumStatusSpaceSummaries: PremiumStatusSpace[]
): Promise<Space[]> {
  const spaces = getFreshSpaceData(premiumStatusSpaceSummaries);
  updateSpaceData(storeService, spaces);
  return Promise.resolve(spaces);
}
export function updateSpaceData(
  storeService: StoreService,
  spaces: Space[]
): void {
  const spaceData = { spaces };
  storeService.dispatch(spaceDataUpdated(spaceData));
  reportDataUpdate(storeService);
}
export function updateCurrentSpaceWith(
  storeService: StoreService,
  iteratee: (currentSpace: Space) => Space
) {
  const spaces = storeService.getSpaceData().spaces.map((space) => {
    if (space.details.status === "accepted") {
      return iteratee(space);
    }
    return space;
  });
  updateSpaceData(storeService, spaces);
}
export function getFreshSpaceData(
  premiumStatusSpaceSummaries: PremiumStatusSpace[]
): Space[] {
  const spaces = (premiumStatusSpaceSummaries || []).map(
    (premiumStatusSpaceSummary) => ({
      teamId: premiumStatusSpaceSummary.teamId,
      details: premiumStatusSpaceSummary,
    })
  );
  return spaces;
}
