import {
  combineLatest,
  distinctUntilChanged,
  map,
  Observable,
  of,
  switchMap,
} from "rxjs";
import { Capability, CarbonLegacyClient } from "@dashlane/communication";
import { Injectable } from "@dashlane/framework-application";
import { getSuccess, isSuccess } from "@dashlane/framework-types";
import { VaultItemType } from "@dashlane/vault-contracts";
import { VaultRepository } from "../vault-repository";
@Injectable()
export class PasswordLimitRepository {
  constructor(
    private readonly carbon: CarbonLegacyClient,
    private vaultRepository: VaultRepository
  ) {}
  public readonly isPasswordLimitEnabled = (): Observable<boolean> => {
    return this._getPasswordsLimitCapability().pipe(
      map((result) => result?.enabled ?? false)
    );
  };
  public readonly getNumberOfPasswordsLeft = (): Observable<
    number | undefined
  > => {
    const credentialsCount$ = this._getCredentialCount();
    const passwordsLimit$ = this._getPasswordsLimitCapability().pipe(
      map((result) => result?.info?.limit)
    );
    return combineLatest([credentialsCount$, passwordsLimit$]).pipe(
      map(([count, limit]) => {
        if (typeof limit === "number") {
          return limit - count;
        }
        return undefined;
      })
    );
  };
  public readonly isFreeUserFrozen = (): Observable<boolean> => {
    const shouldLimit$: Observable<false | number> =
      this._getPasswordsLimitCapability().pipe(
        map((passwordLimitCapability) => {
          return (
            passwordLimitCapability?.enabled &&
            passwordLimitCapability.info?.action === "enforce_freeze" &&
            passwordLimitCapability.info?.limit
          );
        }),
        distinctUntilChanged()
      );
    return shouldLimit$.pipe(
      switchMap((limit) => {
        if (!limit) {
          return of(false);
        }
        return this._getCredentialCount().pipe(map((count) => count > limit));
      })
    );
  };
  public readonly getCurrentPasswordLimit = (): Observable<
    number | undefined
  > => {
    return this._getPasswordsLimitCapability().pipe(
      map((passwordLimitCapability) => {
        if (
          passwordLimitCapability?.enabled &&
          !passwordLimitCapability.info?.limit &&
          passwordLimitCapability.info?.limit !== 0
        ) {
          throw new Error("Cannot get password limit from server");
        }
        return passwordLimitCapability?.info?.limit;
      })
    );
  };
  private readonly _getPasswordsLimitCapability = (): Observable<
    Capability | undefined
  > => {
    return this.carbon.queries.getNodePremiumStatus().pipe(
      map((result) => {
        if (!isSuccess(result)) {
          throw new Error(`Cannot retrieve node premium status from carbon`);
        }
        return getSuccess(result).capabilities?.passwordsLimit;
      })
    );
  };
  private readonly _getCredentialCount = (): Observable<number> => {
    return this.vaultRepository
      .fetchVaultItems$({
        vaultItemTypes: [VaultItemType.Credential],
      })
      .pipe(
        map((result) => {
          if (!isSuccess(result)) {
            throw new Error(`Cannot retrieve credentials from vault`);
          }
          return getSuccess(result).credentialsResult.matchCount;
        })
      );
  };
}
