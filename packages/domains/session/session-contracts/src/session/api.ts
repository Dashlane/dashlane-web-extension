import { defineModuleApi } from '@dashlane/framework-contracts';
import { CheckSessionKeyQuery, CreatedSessionsStateQuery, ExportSessionKeyQuery, SessionStateQuery, } from './queries';
import { SessionClosedEvent, SessionClosingEvent, SessionOpenedEvent, } from './events';
import { CloseUserSessionCommand, CreateUserSessionCommand, DeleteLocalSessionCommand, FlushLocalDataCommand, OpenUserSessionCommand, PrepareLocalDataFlushCommand, } from './commands';
import { SessionOpeningEvent } from './events/session-opening.event';
import { SelectedOpenedSessionQuery } from './queries/selected-opened-session.query';
import { UpdateUserSessionKeyCommand } from './commands/update-user-session-key.command';
export const sessionApi = defineModuleApi({
    name: 'session' as const,
    commands: {
        FlushLocalDataCommand,
        PrepareLocalDataFlushCommand,
        CreateUserSessionCommand,
        OpenUserSessionCommand,
        CloseUserSessionCommand,
        DeleteLocalSessionCommand,
        UpdateUserSessionKeyCommand,
    },
    queries: {
        sessionState: SessionStateQuery,
        createdSessionsState: CreatedSessionsStateQuery,
        selectedOpenedSession: SelectedOpenedSessionQuery,
        checkSessionKey: CheckSessionKeyQuery,
        exportSessionKey: ExportSessionKeyQuery,
    },
    events: {
        SessionOpenedEvent,
        SessionClosingEvent,
        SessionClosedEvent,
        SessionOpeningEvent,
    },
});
