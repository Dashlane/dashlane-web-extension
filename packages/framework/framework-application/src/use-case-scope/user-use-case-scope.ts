import { filter, pairwise, take } from "rxjs";
import { Injectable } from "@nestjs/common";
import { getSuccess, isSuccess, Result } from "@dashlane/framework-types";
import {
  ActiveUserQueryResult,
  RequestContextClient,
} from "@dashlane/framework-contracts";
import { UseCaseScope } from "./use-case-scope";
import { AppLifeCycle } from "../application/app-lifecycle";
@Injectable()
export class UserUseCaseScope extends UseCaseScope {
  public constructor(
    userName: string,
    lifecycle: AppLifeCycle,
    requestContext: RequestContextClient
  ) {
    super(lifecycle);
    requestContext.queries
      .activeUser()
      .pipe(pairwise(), filter(this.thisUserGotDeactivated(userName)), take(1))
      .subscribe(() => {
        this.close();
      });
  }
  private thisUserGotDeactivated(userName: string) {
    return ([previousResult, result]: [
      Result<ActiveUserQueryResult>,
      Result<ActiveUserQueryResult>
    ]): boolean => {
      if (!isSuccess(previousResult) || !isSuccess(result)) {
        return false;
      }
      const previousActiveUser = getSuccess(previousResult).userName;
      const activeUser = getSuccess(result).userName;
      return previousActiveUser === userName && activeUser === undefined;
    };
  }
}
