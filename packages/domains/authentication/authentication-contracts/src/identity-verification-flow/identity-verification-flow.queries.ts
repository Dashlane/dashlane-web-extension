import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { IdentityVerificationFlowView } from "./identity-verification-flow.types";
export class IdentityVerificationFlowStatusQuery extends defineQuery<IdentityVerificationFlowView>(
  {
    scope: UseCaseScope.Device,
  }
) {}
