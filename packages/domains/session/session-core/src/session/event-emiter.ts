import { BaseEventEmitter, Injectable } from "@dashlane/framework-application";
import { sessionApi } from "@dashlane/session-contracts";
@Injectable()
export class SessionEventEmitter extends BaseEventEmitter<typeof sessionApi> {}
