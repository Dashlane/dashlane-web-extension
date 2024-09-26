import { defineEvent, UseCaseScope } from "@dashlane/framework-contracts";
import { CarbonCommandEventCompleted, CarbonLegacyEventPayload } from "./types";
export class CarbonCommandResultEvent extends defineEvent<CarbonCommandEventCompleted>(
  {
    scope: UseCaseScope.Device,
  }
) {}
export class CarbonLegacyEvent extends defineEvent<CarbonLegacyEventPayload>({
  scope: UseCaseScope.Device,
}) {}
export class CarbonLegacyDeviceRemotelyDeleted extends defineEvent<{
  user: string;
}>({
  scope: UseCaseScope.Device,
}) {}
export const events = {
  CarbonCommandResultEvent,
  CarbonLegacyEvent,
  CarbonLegacyDeviceRemotelyDeleted,
};
