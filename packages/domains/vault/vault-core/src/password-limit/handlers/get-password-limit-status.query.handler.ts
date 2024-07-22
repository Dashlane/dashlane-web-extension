import { shallowEqualObjects } from "shallow-equal";
import { combineLatest, distinctUntilChanged, map } from "rxjs";
import {
  IQueryHandler,
  QueryHandler,
  QueryHandlerResponseOf,
} from "@dashlane/framework-application";
import { success } from "@dashlane/framework-types";
import { GetPasswordLimitStatusQuery } from "@dashlane/vault-contracts";
import { PasswordLimitRepository } from "../password-limit-repository";
@QueryHandler(GetPasswordLimitStatusQuery)
export class GetPasswordLimitStatusQueryHandler
  implements IQueryHandler<GetPasswordLimitStatusQuery>
{
  constructor(
    private readonly passwordLimitRepository: PasswordLimitRepository
  ) {}
  execute(): QueryHandlerResponseOf<GetPasswordLimitStatusQuery> {
    const hasPasswordLimit$ =
      this.passwordLimitRepository.isPasswordLimitEnabled();
    const passwordsLeft$ =
      this.passwordLimitRepository.getNumberOfPasswordsLeft();
    const limit$ = this.passwordLimitRepository.getCurrentPasswordLimit();
    return combineLatest([hasPasswordLimit$, passwordsLeft$, limit$]).pipe(
      map(([hasLimit, passwordsLeft, limit]) => {
        if (
          hasLimit &&
          typeof passwordsLeft === "number" &&
          typeof limit === "number"
        ) {
          return {
            hasLimit,
            passwordsLeft,
            limit,
          };
        }
        return { hasLimit: false } as const;
      }),
      distinctUntilChanged(shallowEqualObjects),
      map(success)
    );
  }
}
