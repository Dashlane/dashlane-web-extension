import { firstValueFrom, ReplaySubject, switchMap } from "rxjs";
import {
  CarbonApiEvents,
  CarbonLeelooConnector,
} from "@dashlane/communication";
import { Injectable } from "@dashlane/framework-application";
import { CoreServices } from "Services";
export type Unsubscribe = () => void;
export type CarbonLegacyLeelooCommands = {
  [k in keyof typeof CarbonLeelooConnector]: (
    ...args: Parameters<(typeof CarbonLeelooConnector)[k]>
  ) => ReturnType<(typeof CarbonLeelooConnector)[k]>;
};
export type CarbonLeelooEvents = {
  [k in keyof typeof CarbonLeelooConnector]: {
    on: (typeof CarbonLeelooConnector)[k]["on"];
  };
};
export interface Carbon {
  readonly apiEvents: CarbonApiEvents;
  readonly leelooEventsCommands: CarbonLegacyLeelooCommands;
  readonly leelooEvents: CarbonLeelooEvents;
  readonly coreServices: CoreServices;
}
@Injectable()
export class CarbonLegacyInfrastructure {
  private carbon$ = new ReplaySubject<Carbon>(1);
  public carbonState$ = this.carbon$.pipe(
    switchMap((x) => x.coreServices.storeService.getState$())
  );
  public ready(carbon: Carbon) {
    this.carbon$.next(carbon);
  }
  public initFailed(error: unknown) {
    this.carbon$.error(error);
  }
  public getCarbon(): Promise<Carbon> {
    return firstValueFrom(this.carbon$);
  }
}
export const LEGACY_LEELOO_SLOTS_ALL = Object.keys(
  CarbonLeelooConnector
) as (keyof typeof CarbonLeelooConnector)[];
