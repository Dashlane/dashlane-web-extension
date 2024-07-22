import { IdentityVerificationFlowContracts } from "@dashlane/authentication-contracts";
import { BaseEventEmitter, Injectable } from "@dashlane/framework-application";
@Injectable()
export class IdentityVerificationEventsEmitter extends BaseEventEmitter<
  typeof IdentityVerificationFlowContracts.identityVerificationFlowApi
> {}
