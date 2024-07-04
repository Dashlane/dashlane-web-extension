import { map, Observable } from 'rxjs';
import { IQueryHandler, QueryHandler } from '@dashlane/framework-application';
import { Result, success } from '@dashlane/framework-types';
import { CreatedSessionsStateQuery, CreatedSessionState, } from '@dashlane/session-contracts';
import { SessionsState } from '../../stores/session-state.types';
import { SessionsStateStore } from '../../stores/sessions-state.store';
@QueryHandler(CreatedSessionsStateQuery)
export class CreatedSessionsStateQueryHandler implements IQueryHandler<CreatedSessionsStateQuery> {
    constructor(private sessionsStateStore: SessionsStateStore) { }
    public execute(): Observable<Result<Record<string, CreatedSessionState>>> {
        return this.sessionsStateStore.state$.pipe(map((sessionsState: SessionsState) => {
            const createdSessions: Record<string, CreatedSessionState> = {};
            for (const login in sessionsState) {
                if (sessionsState[login].status === 'open') {
                    createdSessions[login] = CreatedSessionState.Open;
                }
                else {
                    createdSessions[login] = CreatedSessionState.Closed;
                }
            }
            return success(createdSessions);
        }));
    }
}
