import { Space } from "@dashlane/communication";
import { SpaceData } from "Session/Store/spaceData/types";
import { getFreshSpaceData } from "Session/SpaceDataController";
import { StoreService } from "Store";
export const getCurrentSpace = (spaceData: SpaceData): Space => {
  return spaceData.spaces.find(
    (space: Space) => space.details.status === "accepted"
  );
};
export const getCurrentSpaceId = (spaceData: SpaceData): number | undefined => {
  const currentSpace = getCurrentSpace(spaceData);
  return currentSpace ? Number(currentSpace.teamId) : undefined;
};
export const getCurrentTeamId = getCurrentSpaceId;
export const isBillingAdminInCurrentSpace = (spaceData: SpaceData): boolean => {
  const currentSpace = getCurrentSpace(spaceData);
  return currentSpace ? currentSpace.details.isBillingAdmin : false;
};
export const isTeamAdminInCurrentSpace = (spaceData: SpaceData): boolean => {
  const currentSpace = getCurrentSpace(spaceData);
  return currentSpace ? currentSpace.details.isTeamAdmin : false;
};
export const isGroupManagerInCurrentSpace = (spaceData: SpaceData): boolean => {
  const currentSpace = getCurrentSpace(spaceData);
  return currentSpace ? currentSpace.details.isGroupManager : false;
};
export function makeSpaceData(spaces?: Space[]): SpaceData {
  return { spaces: spaces };
}
export const getNodePremiumStatusSpaceData = (storeService: StoreService) => {
  const nodePremiumStatusSpaceSummaries =
    storeService.getLocalSettings().nodePremiumStatus?.spaces;
  const spaces = getFreshSpaceData(nodePremiumStatusSpaceSummaries ?? []);
  return makeSpaceData(spaces);
};
export const hasTACAccessInCurrentSpace = (
  storeService: StoreService
): boolean => {
  const spaceData = getNodePremiumStatusSpaceData(storeService);
  const currentSpace = getCurrentSpace(spaceData);
  return currentSpace
    ? currentSpace.details.isTeamAdmin ||
        currentSpace.details.isBillingAdmin ||
        currentSpace.details.isGroupManager
    : false;
};
export const hasSpecialUserGroupAccessInSpace = (
  spaceTeamId: string,
  spaceData: SpaceData
) => {
  const matchingSpace = spaceData.spaces.find(
    (space: Space) =>
      space.teamId === spaceTeamId && space.details.status === "accepted"
  );
  return (
    matchingSpace?.details.isTeamAdmin || matchingSpace?.details.isGroupManager
  );
};
