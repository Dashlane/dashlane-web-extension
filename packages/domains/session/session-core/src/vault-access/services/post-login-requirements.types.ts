import { Observable } from 'rxjs';
import { NotAllowedReason } from '@dashlane/session-contracts';
export interface PostLoginRequirementsChecker {
    readonly name: string;
    check: (login?: string) => Observable<NotAllowedReason[]>;
}
