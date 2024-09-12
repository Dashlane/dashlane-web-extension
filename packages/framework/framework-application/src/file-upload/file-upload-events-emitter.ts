import { fileUploadApi } from "@dashlane/framework-contracts";
import { BaseEventEmitter } from "../client/define-event-emitter";
import { Injectable } from "../dependency-injection";
@Injectable()
export class FileUploadedEventsEmitter extends BaseEventEmitter<
  typeof fileUploadApi
> {}
