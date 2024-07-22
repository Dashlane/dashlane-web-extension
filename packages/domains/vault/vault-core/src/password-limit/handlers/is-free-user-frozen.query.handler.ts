import { distinctUntilChanged, map } from "rxjs";
import {
  IQueryHandler,
  QueryHandler,
  QueryHandlerResponseOf,
} from "@dashlane/framework-application";
import { success } from "@dashlane/framework-types";
import { IsFreeUserFrozenQuery } from "@dashlane/vault-contracts";
import { PasswordLimitRepository } from "../password-limit-repository";
@QueryHandler(IsFreeUserFrozenQuery)
export class IsFreeUserFrozenQueryHandler
  implements IQueryHandler<IsFreeUserFrozenQuery>
{
  constructor(
    private readonly passwordLimitRepository: PasswordLimitRepository
  ) {}
  execute(): QueryHandlerResponseOf<IsFreeUserFrozenQuery> {
    return this.passwordLimitRepository
      .isFreeUserFrozen()
      .pipe(distinctUntilChanged(), map(success));
  }
}
