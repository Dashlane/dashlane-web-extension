import { defineEvent, UseCaseScope } from "@dashlane/framework-contracts";
export type SessionKey =
  | {
      type: "mp";
      masterPassword: string;
    }
  | {
      type: "sso";
    };
export interface SessionOpenedEventPayload {
  login: string;
  sessionKey: SessionKey;
}
export class SessionOpenedEvent extends defineEvent<SessionOpenedEventPayload>({
  scope: UseCaseScope.User,
}) {}
