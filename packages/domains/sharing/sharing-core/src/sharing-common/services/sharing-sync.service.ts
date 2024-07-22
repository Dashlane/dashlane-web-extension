import { isSuccess, success } from "@dashlane/framework-types";
import { filter, firstValueFrom } from "rxjs";
import { Injectable } from "@dashlane/framework-application";
import { SyncClient, SyncStatuses } from "@dashlane/sync-contracts";
import { Trigger } from "@dashlane/hermes";
@Injectable()
export class SharingSyncService {
  constructor(private syncClient: SyncClient) {}
  async scheduleSync() {
    const { commands } = this.syncClient;
    await this.waitOnSyncToFinish();
    await commands.sync({ trigger: Trigger.Sharing });
    return success(undefined);
  }
  async runSync() {
    await this.scheduleSync();
    await this.waitOnSyncToFinish();
    return success(undefined);
  }
  private waitOnSyncToFinish() {
    return firstValueFrom(
      this.syncClient.queries.syncProgress().pipe(
        filter(isSuccess),
        filter((s) => s.data.status !== SyncStatuses.IN_PROGRESS)
      )
    );
  }
}
