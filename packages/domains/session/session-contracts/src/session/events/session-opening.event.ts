import { defineEvent, UseCaseScope } from "@dashlane/framework-contracts";
export class SessionOpeningEvent extends defineEvent({
  scope: UseCaseScope.User,
}) {}
