import { isCredential, PremiumStatusSpace } from "@dashlane/communication";
import { assertUnreachable } from "Helpers/assert-unreachable";
import { PERSONAL_SPACE_ID } from "DataManagement/Spaces/constants";
import {
  ForceCategorizable,
  ForceCategorizationTeamSpacePick,
  SpaceWithForceCategorization,
  TeamDomainsMatchResult,
} from "DataManagement/SmartTeamSpaces/forced-categorization.domain-types";
import { pickBestTeamSpaceForForcedCategorization } from "DataManagement/SmartTeamSpaces/forced-categorization.domain";
import {
  TeamSpaceContentControlChanges,
  TeamSpaceContentControlState,
} from "DataManagement/SmartTeamSpaces/team-space-content-control.domain-types";
import { getUpdatedItemChangeHistory } from "DataManagement/ChangeHistory";
import {
  makeRemovalChange,
  makeUpdateChange,
} from "DataManagement/ChangeHistory/change";
function getInitialChanges(): TeamSpaceContentControlChanges {
  return {
    deletions: {
      KWAuthentifiant: [],
      KWEmail: [],
      KWGeneratedPassword: [],
    },
    updates: [],
    changeHistories: [],
    hiddenItemIds: [],
  };
}
function updateItemWithSpaceId(item: ForceCategorizable, spaceId: string) {
  return {
    ...item,
    SpaceId: spaceId,
  };
}
function forceCategorizeItem(
  state: TeamSpaceContentControlState,
  changes: TeamSpaceContentControlChanges,
  teamSpace: PremiumStatusSpace,
  item: ForceCategorizable
): TeamSpaceContentControlChanges {
  const { updates, changeHistories } = changes;
  const { teamId: teamSpaceId } = teamSpace;
  const { deviceName, login: userLogin, personalData, platformInfo } = state;
  const updatedItem = updateItemWithSpaceId(item, teamSpaceId);
  const changeHistory = isCredential(updatedItem)
    ? getUpdatedItemChangeHistory({
        change: makeUpdateChange(updatedItem),
        deviceName,
        personalData,
        userLogin,
        platformInfo,
      })
    : null;
  return {
    ...changes,
    updates: updates.concat(updatedItem),
    changeHistories: changeHistory
      ? changeHistories.concat(changeHistory)
      : changeHistories,
  };
}
function deleteItemAfterEndOfQuarantine(
  state: TeamSpaceContentControlState,
  changes: TeamSpaceContentControlChanges,
  item: ForceCategorizable
): TeamSpaceContentControlChanges {
  const { deletions, changeHistories } = changes;
  const { deviceName, login: userLogin, personalData, platformInfo } = state;
  const { kwType } = item;
  const changeHistory = isCredential(item)
    ? getUpdatedItemChangeHistory({
        change: makeRemovalChange(item),
        deviceName,
        personalData,
        userLogin,
        platformInfo,
      })
    : null;
  return {
    ...changes,
    deletions: {
      ...deletions,
      [kwType]: deletions[kwType].concat(item.Id),
    },
    changeHistories: changeHistory
      ? changeHistories.concat(changeHistory)
      : changeHistories,
  };
}
function moveItemToPersonalSpaceAfterEndOfQuarantine(
  state: TeamSpaceContentControlState,
  changes: TeamSpaceContentControlChanges,
  item: ForceCategorizable
): TeamSpaceContentControlChanges {
  const { updates, changeHistories } = changes;
  const { deviceName, login: userLogin, personalData, platformInfo } = state;
  const updatedItem = updateItemWithSpaceId(item, PERSONAL_SPACE_ID);
  const changeHistory = isCredential(updatedItem)
    ? getUpdatedItemChangeHistory({
        change: makeUpdateChange(updatedItem),
        deviceName,
        personalData,
        userLogin,
        platformInfo,
      })
    : null;
  return {
    ...changes,
    updates: updates.concat(updatedItem),
    changeHistories: changeHistory
      ? changeHistories.concat(changeHistory)
      : changeHistories,
  };
}
function controlRevokedTeamSpaceItemAfterQuarantine(
  state: TeamSpaceContentControlState,
  teamSpacePick: ForceCategorizationTeamSpacePick,
  item: ForceCategorizable,
  changes: TeamSpaceContentControlChanges
) {
  const { domainsMatchResult } = teamSpacePick;
  switch (domainsMatchResult) {
    case TeamDomainsMatchResult.SomeFieldsMatch:
      return deleteItemAfterEndOfQuarantine(state, changes, item);
    case TeamDomainsMatchResult.NoFieldMatch:
      return moveItemToPersonalSpaceAfterEndOfQuarantine(state, changes, item);
    default:
      return assertUnreachable(domainsMatchResult);
  }
}
const shouldDeleteForcedCategorizedContent = (
  teamSpace: SpaceWithForceCategorization["details"]
) => {
  return teamSpace.info.removeForcedContentEnabled && teamSpace.shouldDelete;
};
function controlRevokedTeamSpaceItem(
  state: TeamSpaceContentControlState,
  teamSpacePick: ForceCategorizationTeamSpacePick,
  item: ForceCategorizable,
  changes: TeamSpaceContentControlChanges
): TeamSpaceContentControlChanges {
  const { teamSpace, domainsMatchResult } = teamSpacePick;
  const { hiddenItemIds } = changes;
  const shouldDeleteContent = shouldDeleteForcedCategorizedContent(teamSpace);
  const changesWithDeletionsAndMoves = shouldDeleteContent
    ? controlRevokedTeamSpaceItemAfterQuarantine(
        state,
        teamSpacePick,
        item,
        changes
      )
    : changes;
  const updatedHiddenItemIds =
    domainsMatchResult === TeamDomainsMatchResult.SomeFieldsMatch
      ? [...hiddenItemIds, item.Id]
      : hiddenItemIds;
  return {
    ...changesWithDeletionsAndMoves,
    hiddenItemIds: updatedHiddenItemIds,
  };
}
function controlTeamSpaceItem(
  state: TeamSpaceContentControlState,
  changes: TeamSpaceContentControlChanges,
  item: ForceCategorizable
): TeamSpaceContentControlChanges {
  const teamSpaces = state.spaces.map((s) => s.details);
  const pick = pickBestTeamSpaceForForcedCategorization(
    teamSpaces,
    item,
    state.credentials
  );
  if (!pick) {
    return changes;
  }
  const { teamSpace } = pick;
  const { status: spaceStatus } = teamSpace;
  switch (spaceStatus) {
    case "accepted":
      return forceCategorizeItem(state, changes, teamSpace, item);
    case "revoked":
      return controlRevokedTeamSpaceItem(state, pick, item, changes);
    default:
      return changes;
  }
}
export function controlTeamSpacesContent(
  state: TeamSpaceContentControlState
): TeamSpaceContentControlChanges {
  const initialChanges = getInitialChanges();
  if (state.spaces.length === 0) {
    return initialChanges;
  }
  return state.items.reduce(
    (changes: TeamSpaceContentControlChanges, item: ForceCategorizable) =>
      controlTeamSpaceItem(state, changes, item),
    initialChanges
  );
}
