import {
  AppLifeCycle,
  CqrsClient,
  FrameworkInit,
  OnFrameworkInit,
} from "@dashlane/framework-application";
import { requestContextApi } from "@dashlane/framework-contracts";
import { distinctUntilChanged, map, switchMap } from "rxjs";
import { CarbonEventEmitter } from "./carbon-events-emitter";
import { relayLeelooLegacyEvents } from "./carbon-legacy-event-relay";
import { CarbonLegacyInfrastructure } from "./carbon-legacy-infrastructure";
import { getCarbonLegacyStateSelector } from "./carbon-state.selector";
interface CarbonActiveUserSession {
  account: {
    login: string;
    isAuthenticated: true;
  };
}
const isActiveUserSession = (x: unknown): x is CarbonActiveUserSession => {
  if (!x || typeof x !== "object") {
    return false;
  }
  if (!("account" in x) || !x.account || typeof x.account !== "object") {
    return false;
  }
  if (
    !("login" in x.account) ||
    !x.account.login ||
    typeof x.account.login !== "string"
  ) {
    return false;
  }
  if (!("isAuthenticated" in x.account) || !x.account.isAuthenticated) {
    return false;
  }
  return true;
};
@FrameworkInit()
export class CarbonLegacyBootstrap implements OnFrameworkInit {
  private setActiveUser: (arg: { userName?: string }) => Promise<unknown>;
  constructor(
    client: CqrsClient,
    private infra: CarbonLegacyInfrastructure,
    private lifeCycle: AppLifeCycle,
    private eventEmitter: CarbonEventEmitter
  ) {
    const { setActiveUser } = client.getClient(requestContextApi).commands;
    this.setActiveUser = setActiveUser;
  }
  public onFrameworkInit() {
    this.lifeCycle.addExternalComponentReadyCondition(
      async () => await this.infra.getCarbon()
    );
    this.lifeCycle.addAppReadyHook(async () => {
      const subscription = this.infra.carbonState$
        .pipe(
          map((x) => {
            const account = getCarbonLegacyStateSelector(
              x,
              "userSession.account"
            );
            return {
              account,
            };
          }),
          map((data) => {
            if (!isActiveUserSession(data)) {
              return undefined;
            }
            return data.account.login;
          }),
          distinctUntilChanged(),
          switchMap(async (userName) => {
            await this.setActiveUser({ userName });
          })
        )
        .subscribe();
      const carbon = await this.infra.getCarbon();
      const unsubscribeCarbonEvents = relayLeelooLegacyEvents(
        carbon.leelooEvents,
        this.eventEmitter
      );
      return () => {
        subscription.unsubscribe();
        unsubscribeCarbonEvents();
      };
    });
  }
}
