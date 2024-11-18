import { defineQuery, UseCaseScope } from "@dashlane/framework-contracts";
import { ValuesType } from "@dashlane/framework-types";
export const SessionStates = Object.freeze({
  Open: "open",
  Closed: "closed",
  Opening: "opening",
});
export type SessionState = ValuesType<typeof SessionStates>;
export interface LocalSession {
  login: string;
  deviceAccessKey: string;
  state: SessionState;
}
export class LocalSessionsQuery extends defineQuery<
  Record<string, LocalSession>
>({ scope: UseCaseScope.Device }) {}
