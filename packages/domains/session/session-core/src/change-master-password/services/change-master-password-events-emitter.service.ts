import { changeMasterPasswordApi } from "@dashlane/session-contracts";
import { BaseEventEmitter, Injectable } from "@dashlane/framework-application";
@Injectable()
export class ChangeMasterPasswordEventsEmitterService extends BaseEventEmitter<
  typeof changeMasterPasswordApi
> {}
