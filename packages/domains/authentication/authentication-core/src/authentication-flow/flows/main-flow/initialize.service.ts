import { filter, firstValueFrom, map } from "rxjs";
import { CarbonLegacyClient, LocalAccountInfo } from "@dashlane/communication";
import { Injectable } from "@dashlane/framework-application";
import {
  AuthenticationFlowContracts,
  PinCodeClient,
} from "@dashlane/authentication-contracts";
import { isFailure, isSuccess } from "@dashlane/framework-types";
import { MachineInitializationResult } from "./types";
import { ReactivationStatus } from "../../carbon/types";
interface LocalAccountsAuthenticationState {
  accountsList: LocalAccountInfo[];
  reactivationStatus: ReactivationStatus;
  accountsListInitialized: boolean;
}
@Injectable()
export class InitializeMachineService {
  public constructor(
    private carbonLegacyClient: CarbonLegacyClient,
    private pinCodeClient: PinCodeClient
  ) {}
  private retrieveLocalAccounts(): Promise<
    AuthenticationFlowContracts.LocalAccount[] | undefined
  > {
    return firstValueFrom(
      this.carbonLegacyClient.queries
        .carbonState({
          path: "authentication.localAccounts",
        })
        .pipe(
          filter(isSuccess),
          filter(
            (state) =>
              (state.data as LocalAccountsAuthenticationState)
                .accountsListInitialized
          ),
          map(
            (state) =>
              (state.data as LocalAccountsAuthenticationState).accountsList
          )
        )
    );
  }
  private async getPinCodeStatus(login?: string): Promise<boolean> {
    if (!login) {
      return false;
    }
    const getPinCodeStatusResult = await firstValueFrom(
      this.pinCodeClient.queries.getStatus({
        loginEmail: login,
      })
    );
    if (isFailure(getPinCodeStatusResult)) {
      return false;
    }
    return getPinCodeStatusResult.data.isPinCodeEnabled;
  }
  public async execute(): Promise<MachineInitializationResult> {
    const retrieveLocalAccountsData = await this.retrieveLocalAccounts();
    const localAccounts = retrieveLocalAccountsData;
    const lastSuccessfulAccount = localAccounts?.find(
      (a) => a.isLastSuccessfulLogin
    );
    const hasPinCodeEnabled = await this.getPinCodeStatus(
      lastSuccessfulAccount?.login
    );
    const res = {
      localAccounts: localAccounts ?? [],
      lastUsedLogin: lastSuccessfulAccount?.login ?? "",
      shouldAskMasterPassword:
        lastSuccessfulAccount?.shouldAskMasterPassword ?? false,
      shouldAskPinCode: hasPinCodeEnabled,
      shouldAskOTP: lastSuccessfulAccount?.hasLoginOtp ?? false,
      rememberMeType: lastSuccessfulAccount?.rememberMeType ?? "disabled",
    };
    return res;
  }
}
