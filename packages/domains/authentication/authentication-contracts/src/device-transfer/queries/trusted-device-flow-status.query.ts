import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { TrustedDeviceFlowView } from "../types";
export class TrustedDeviceFlowStatusQuery extends defineQuery<TrustedDeviceFlowView>(
  {
    scope: UseCaseScope.Device,
  }
) {}
