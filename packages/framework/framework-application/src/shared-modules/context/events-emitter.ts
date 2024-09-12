import { requestContextApi } from "@dashlane/framework-contracts";
import { BaseEventEmitter } from "../../client/define-event-emitter";
import { Injectable } from "../../dependency-injection/injectable.decorator";
@Injectable()
export class RequestContextEventsEmitter extends BaseEventEmitter<
  typeof requestContextApi
> {}
