import { from, map, Observable } from "rxjs";
import { IQueryHandler, QueryHandler } from "@dashlane/framework-application";
import {
  getSuccess,
  isFailure,
  Result,
  success,
} from "@dashlane/framework-types";
import {
  LocalAccountsQuery,
  LocalAccountsQueryResult,
} from "@dashlane/authentication-contracts";
import { CarbonLegacyClient, LocalAccountInfo } from "@dashlane/communication";
export interface LocalAccountsListResponse {
  success: boolean;
  localAccounts: LocalAccountInfo[];
}
@QueryHandler(LocalAccountsQuery)
export class LocalAccountsQueryHandler
  implements IQueryHandler<LocalAccountsQuery>
{
  public constructor(private carbon: CarbonLegacyClient) {}
  private isLocalAccounts(x: unknown): x is LocalAccountInfo[] {
    if (!Array.isArray(x)) {
      return false;
    }
    if (x.length === 0) {
      return true;
    }
    const firstObject = x[0];
    return typeof firstObject === "object" && "login" in firstObject;
  }
  private isCarbonLocalAccountResult(x: unknown): x is {
    localAccounts: LocalAccountInfo[];
  } {
    if (x && typeof x === "object" && "localAccounts" in x) {
      return this.isLocalAccounts(x.localAccounts);
    } else {
      return false;
    }
  }
  public execute(): Observable<Result<LocalAccountsQueryResult>> {
    return from(
      this.carbon.commands.carbonLegacyLeeloo({
        name: "getLocalAccountsList",
        arg: [],
      })
    ).pipe(
      map((accountsList) => {
        if (isFailure(accountsList)) {
          throw new Error("Unable to retrieve local accounts list");
        }
        const carbonResponse = getSuccess(accountsList).carbonResult;
        if (!this.isCarbonLocalAccountResult(carbonResponse)) {
          throw new Error("Carbon result is not of type local accounts");
        }
        return success({ localAccounts: carbonResponse.localAccounts });
      })
    );
  }
}
