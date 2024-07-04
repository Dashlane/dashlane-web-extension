import { distinctUntilChanged, map, Observable } from 'rxjs';
import { IQueryHandler, QueryHandler } from '@dashlane/framework-application';
import { Result, success } from '@dashlane/framework-types';
import { SelectedOpenedSessionQuery, SessionState, } from '@dashlane/session-contracts';
import { SessionsStateStore } from '../../stores/sessions-state.store';
import { SessionsState } from '../../stores/session-state.types';
@QueryHandler(SelectedOpenedSessionQuery)
export class SelectedOpenedSessionQueryHandler implements IQueryHandler<SelectedOpenedSessionQuery> {
    constructor(private sessionsStateStore: SessionsStateStore) { }
    execute(): Observable<Result<string | undefined>> {
        return this.sessionsStateStore.state$.pipe(map((sessionsState: SessionsState) => {
            let currentLogin = undefined;
            for (const login in sessionsState) {
                if (sessionsState[login].status === SessionState.Open) {
                    currentLogin = login;
                }
            }
            return currentLogin;
        }), distinctUntilChanged(), map(success));
    }
}
