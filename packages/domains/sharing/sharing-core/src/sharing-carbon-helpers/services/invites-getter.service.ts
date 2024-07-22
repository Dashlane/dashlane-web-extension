import { CarbonLegacyClient } from "@dashlane/communication";
import { Injectable } from "@dashlane/framework-application";
import { mapSuccessObservable } from "@dashlane/framework-types";
import { isSharingSyncState } from "../../sharing-invites/carbon-helpers/sharing-sync-state";
@Injectable()
export class InviteGetterService {
  public constructor(private carbonLegacyClient: CarbonLegacyClient) {}
  public get() {
    const {
      queries: { carbonState },
    } = this.carbonLegacyClient;
    const sharingSyncState$ = carbonState({
      path: "userSession.sharingSync",
    });
    return sharingSyncState$.pipe(
      mapSuccessObservable((state) => {
        if (!isSharingSyncState(state)) {
          throw new Error("Bad SharingSync format");
        }
        return state;
      })
    );
  }
}
