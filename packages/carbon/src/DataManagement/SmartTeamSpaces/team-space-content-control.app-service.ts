import {
  ApplicationModulesAccess,
  isCredential,
} from "@dashlane/communication";
import { EventBusService, TeamSpaceContentControlDone } from "EventBus";
import { StoreService } from "Store";
import { sendExceptionLog } from "Logs/Exception";
import { SessionService } from "User/Services/types";
import { teamSpaceContentControlApplied } from "Session/Store/personalData/actions";
import { teamSpaceContentControlStateSelector } from "DataManagement/SmartTeamSpaces/team-space-content-control.selectors";
import { TeamSpaceContentControlChanges } from "DataManagement/SmartTeamSpaces/team-space-content-control.domain-types";
import { controlTeamSpacesContent } from "DataManagement/SmartTeamSpaces/team-space-content-control.domain";
import { WSService } from "Libs/WS";
import { ukiSelector } from "Authentication";
import { SpaceWithForceCategorization } from "./forced-categorization.domain-types";
import { spacesWithForcedCategorizationEnabledSelector } from "./forced-categorization.selectors";
function countChangesDeletions({
  deletions,
}: TeamSpaceContentControlChanges): number {
  return Object.keys(deletions).reduce(
    (acc, type) => acc + deletions[type].length,
    0
  );
}
async function applyChangesToVault(
  sessionService: SessionService,
  storeService: StoreService,
  changes: TeamSpaceContentControlChanges
) {
  const { updates, deletions, changeHistories } = changes;
  const hasUpdates = updates.length > 0;
  const hasDeletions = countChangesDeletions(changes) > 0;
  if (hasUpdates || hasDeletions) {
    storeService.dispatch(
      teamSpaceContentControlApplied(updates, deletions, changeHistories)
    );
    await sessionService.getInstance().user.persistPersonalData();
  }
}
function sendTeamSpaceContentControlDoneEvent(
  eventBus: EventBusService,
  changes: TeamSpaceContentControlChanges
) {
  const { deletions, hiddenItemIds, updates } = changes;
  const payload: TeamSpaceContentControlDone = {
    deletedItemIds: Object.keys(deletions).reduce(
      (acc, deletedType) => [...acc, ...deletions[deletedType]],
      []
    ),
    hiddenItemIds,
    updatedItemIds: updates.map((update) => update.Id),
  };
  eventBus.teamSpaceContentControlDone(payload);
}
function sendSpaceDeletedEvent(
  storeService: StoreService,
  wsService: WSService,
  spacesToDelete: SpaceWithForceCategorization[]
) {
  const login = storeService.getUserLogin();
  const uki = ukiSelector(storeService.getState());
  spacesToDelete.forEach((oldSpace) => {
    wsService.teamPlans.spaceDeleted({
      login,
      uki,
      teamId: Number(oldSpace.teamId),
    });
  });
}
export async function applyTeamSpaceContentControlRules(
  eventBus: EventBusService,
  sessionService: SessionService,
  storeService: StoreService,
  wsService: WSService,
  applicationModulesAccess: ApplicationModulesAccess
): Promise<void> {
  try {
    const state = storeService.getState();
    const spaces = spacesWithForcedCategorizationEnabledSelector(state);
    if (spaces.length === 0) {
      return;
    }
    const changes = controlTeamSpacesContent({
      spaces,
      ...teamSpaceContentControlStateSelector(state),
    });
    const deletedCredentialIds = changes.deletions.KWAuthentifiant || [];
    const updatedCredentialIds = changes.updates
      .filter(isCredential)
      .map((item) => item.Id);
    const hiddenCredentialIds = changes.hiddenItemIds;
    const credentialIds = [
      ...deletedCredentialIds,
      ...updatedCredentialIds,
      ...hiddenCredentialIds,
    ];
    await applyChangesToVault(sessionService, storeService, changes);
    const spacesToDelete = spaces.filter((space) => space.details.shouldDelete);
    sendSpaceDeletedEvent(storeService, wsService, spacesToDelete);
    sendTeamSpaceContentControlDoneEvent(eventBus, changes);
    if (credentialIds.length > 0) {
      const {
        commands: { recalculatePasswordHealth },
      } = applicationModulesAccess.createClients().passwordHealth;
      void recalculatePasswordHealth();
    }
  } catch (error) {
    const message = `[Spaces] - runTeamSpaceContentControlJob: ${error}`;
    const augmentedError = new Error(message);
    sendExceptionLog({ error: augmentedError });
  }
}
