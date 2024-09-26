import { BreachesUpdaterChanges } from "DataManagement/Breaches/AppServices/types";
import { VersionedBreach } from "DataManagement/Breaches/types";
import { BreachRepository } from "DataManagement/Breaches/Repositories/interfaces";
import { breachesUpdated } from "Session/Store/personalData/actions";
import { getInstance as getEventStoreInstance } from "EventStore/event-store-instance";
import { getInstance as getEventStoreConsumerInstance } from "EventStore/event-store-consumer-instance";
import { StoreService } from "Store";
import {
  breachesSelector,
  privateBreachesLastUpdateTimestamp,
  publicBreachesRevisionSelector,
} from "DataManagement/Breaches/selectors";
export class BreachVault implements BreachRepository {
  public constructor(private storeService: StoreService) {}
  public async applyChangesFromSync(
    changes: BreachesUpdaterChanges,
    updatedRevision: number,
    updatedPrivateBreachesRefreshDate: number
  ): Promise<void> {
    const updateBreachesAction = breachesUpdated(
      changes,
      updatedRevision,
      updatedPrivateBreachesRefreshDate
    );
    let iconsLockId: string | null = null;
    const { updates, deletions } = changes;
    const areChanges = updates.length + deletions.length;
    const eventStore = getEventStoreInstance();
    const eventStoreConsumer = getEventStoreConsumerInstance();
    try {
      if (areChanges) {
        iconsLockId = eventStoreConsumer.lockTopic("iconsUpdates");
        await eventStore.add("iconsUpdates", {
          type: "breachUpdates",
          breachesIds: updates.map((breach) => breach.Id),
        });
      }
      this.storeService.dispatch(updateBreachesAction);
      if (areChanges) {
        eventStoreConsumer.releaseTopic("iconsUpdates", iconsLockId);
      }
    } catch (exception) {
      if (iconsLockId) {
        eventStoreConsumer.releaseTopic("iconsUpdates", iconsLockId);
      }
      throw exception;
    }
  }
  public getAllBreaches(): VersionedBreach[] {
    const state = this.storeService.getState();
    return breachesSelector(state);
  }
  public getLatestPublicBreachesRevision(): number {
    const state = this.storeService.getState();
    return publicBreachesRevisionSelector(state);
  }
  public getPrivateBreachesRefreshDate(): number {
    const state = this.storeService.getState();
    return privateBreachesLastUpdateTimestamp(state);
  }
}
