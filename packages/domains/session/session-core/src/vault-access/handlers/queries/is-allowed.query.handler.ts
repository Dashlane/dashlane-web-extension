import { map } from 'rxjs';
import { IQueryHandler, QueryHandler, type QueryHandlerResponseOf, } from '@dashlane/framework-application';
import { success } from '@dashlane/framework-types';
import { IsAllowedQuery } from '@dashlane/session-contracts';
import { PostLoginRequirementsCheckerService } from '../../services/post-login-requirements-checker.service';
@QueryHandler(IsAllowedQuery)
export class IsAllowedQueryHandler implements IQueryHandler<IsAllowedQuery> {
    constructor(private readonly postLoginRequirementsChecker: PostLoginRequirementsCheckerService) { }
    execute(): QueryHandlerResponseOf<IsAllowedQuery> {
        return this.postLoginRequirementsChecker.execute().pipe(map(success));
    }
}
