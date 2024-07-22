import { defineEvent, UseCaseScope } from "@dashlane/framework-contracts";
export class IdentityVerificationCompletedEvent extends defineEvent<{
  authTicket: string;
}>({
  scope: UseCaseScope.Device,
}) {}
