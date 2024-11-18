import { defineModuleApi } from "@dashlane/framework-contracts";
import {
  CheckSessionKeyQuery,
  ExportSessionKeyQuery,
  LocalSessionsQuery,
} from "./queries";
import {
  SessionClosedEvent,
  SessionClosingEvent,
  SessionOpenedEvent,
} from "./events";
import {
  CloseUserSessionCommand,
  CopyUserDataAndOpenSessionCommand,
  CreateUserSessionCommand,
  DeleteLocalSessionCommand,
  FlushLocalDataCommand,
  OpenUserSessionCommand,
  PrepareLocalDataFlushCommand,
} from "./commands";
import { SessionOpeningEvent } from "./events/session-opening.event";
import { SelectedOpenedSessionQuery } from "./queries/selected-opened-session.query";
import { UpdateUserSessionKeyCommand } from "./commands/update-user-session-key.command";
import { CurrentSessionInfoQuery } from "./queries/session-info-query";
export const sessionApi = defineModuleApi({
  name: "session" as const,
  commands: {
    FlushLocalDataCommand,
    PrepareLocalDataFlushCommand,
    CreateUserSessionCommand,
    OpenUserSessionCommand,
    CloseUserSessionCommand,
    DeleteLocalSessionCommand,
    CopyUserDataAndOpenSessionCommand,
    UpdateUserSessionKeyCommand,
  },
  queries: {
    selectedOpenedSession: SelectedOpenedSessionQuery,
    checkSessionKey: CheckSessionKeyQuery,
    exportSessionKey: ExportSessionKeyQuery,
    currentSessionInfo: CurrentSessionInfoQuery,
    localSessions: LocalSessionsQuery,
  },
  events: {
    SessionOpenedEvent,
    SessionClosingEvent,
    SessionClosedEvent,
    SessionOpeningEvent,
  },
});
