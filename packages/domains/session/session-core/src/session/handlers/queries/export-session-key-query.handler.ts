import { IQueryHandler, QueryHandler } from '@dashlane/framework-application';
import { Result, success } from '@dashlane/framework-types';
import { ExportedSessionKey, ExportSessionKeyQuery, SessionState, } from '@dashlane/session-contracts';
import { concatMap, Observable } from 'rxjs';
import { SessionsStateStore } from '../../stores/sessions-state.store';
import { SessionKeyExporter } from '../../services/session-key-exporter';
@QueryHandler(ExportSessionKeyQuery)
export class ExportSessionKeyQueryHandler implements IQueryHandler<ExportSessionKeyQuery> {
    constructor(private readonly store: SessionsStateStore, private readonly exporter: SessionKeyExporter) { }
    execute(): Observable<Result<ExportedSessionKey>> {
        return this.store.state$.pipe(concatMap(async (sessionsState) => {
            let currentLogin = undefined;
            for (const login in sessionsState) {
                if (sessionsState[login].status === SessionState.Open) {
                    currentLogin = login;
                }
            }
            if (!currentLogin) {
                throw new Error('No opened session');
            }
            const session = sessionsState[currentLogin];
            if (session.status !== 'open') {
                throw new Error('No opened session');
            }
            return success(await this.exporter.export(session.sessionKey));
        }));
    }
}
