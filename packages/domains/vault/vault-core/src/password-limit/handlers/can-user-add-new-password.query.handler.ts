import { combineLatest, map } from "rxjs";
import {
  IQueryHandler,
  QueryHandler,
  QueryHandlerResponseOf,
} from "@dashlane/framework-application";
import { success } from "@dashlane/framework-types";
import { CanUserAddNewPasswordQuery } from "@dashlane/vault-contracts";
import { PasswordLimitRepository } from "../password-limit-repository";
@QueryHandler(CanUserAddNewPasswordQuery)
export class CanUserAddNewPasswordQueryHandler
  implements IQueryHandler<CanUserAddNewPasswordQuery>
{
  constructor(
    private readonly passwordLimitRepository: PasswordLimitRepository
  ) {}
  execute(): QueryHandlerResponseOf<CanUserAddNewPasswordQuery> {
    const hasPasswordLimit$ =
      this.passwordLimitRepository.isPasswordLimitEnabled();
    const passwordsLeft$ =
      this.passwordLimitRepository.getNumberOfPasswordsLeft();
    return combineLatest(hasPasswordLimit$, passwordsLeft$).pipe(
      map(([hasPasswordLimit, passwordsLeft]) => {
        if (hasPasswordLimit && typeof passwordsLeft === "number") {
          return success(passwordsLeft > 0);
        }
        return success(true);
      })
    );
  }
}
