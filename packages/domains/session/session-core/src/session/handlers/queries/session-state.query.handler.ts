import { map, Observable } from 'rxjs';
import { IQueryHandler, QueryHandler } from '@dashlane/framework-application';
import { assertUnreachable, Result, success } from '@dashlane/framework-types';
import { SessionState, SessionStateQuery } from '@dashlane/session-contracts';
import { SessionsStateStore } from '../../stores/sessions-state.store';
import { SessionsState } from '../../stores/session-state.types';
@QueryHandler(SessionStateQuery)
export class SessionStateQueryHandler implements IQueryHandler<SessionStateQuery> {
    constructor(private sessionsStateStore: SessionsStateStore) { }
    public execute({ body, }: SessionStateQuery): Observable<Result<SessionState>> {
        const sessionLogin = body.email;
        return this.sessionsStateStore.state$.pipe(map((sessionsState: SessionsState) => {
            if (sessionLogin in sessionsState) {
                const { status } = sessionsState[sessionLogin];
                switch (status) {
                    case 'open':
                        return success(SessionState.Open);
                    case 'closed':
                    case 'opening':
                        return success(SessionState.Closed);
                    default:
                        assertUnreachable(status);
                }
            }
            else {
                return success(SessionState.NotCreated);
            }
        }));
    }
}
