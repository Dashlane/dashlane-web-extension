import { CarbonLegacyClient } from "@dashlane/communication";
import {
  IQueryHandler,
  QueryHandler,
  type QueryHandlerResponseOf,
} from "@dashlane/framework-application";
import { isSuccess, success } from "@dashlane/framework-types";
import { DeviceLimitQuery } from "@dashlane/session-contracts";
import { map } from "rxjs";
import { testIsDeviceLimited } from "./carbon-device-limit";
@QueryHandler(DeviceLimitQuery)
export class DeviceLimitQueryHandler
  implements IQueryHandler<DeviceLimitQuery>
{
  constructor(private readonly carbon: CarbonLegacyClient) {}
  execute(): QueryHandlerResponseOf<DeviceLimitQuery> {
    const { liveLoginDeviceLimitFlow } = this.carbon.queries;
    return liveLoginDeviceLimitFlow(undefined).pipe(
      map((liveDeviceLimit) => {
        if (!isSuccess(liveDeviceLimit)) {
          throw new Error("liveLoginDeviceLimitFlow failed");
        }
        return success({
          isLimited: testIsDeviceLimited(liveDeviceLimit.data),
        });
      })
    );
  }
}
