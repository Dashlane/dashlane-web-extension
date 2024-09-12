import { UseCaseScope } from "@dashlane/framework-contracts";
import { Class } from "@dashlane/framework-types";
import { Mutex } from "async-mutex";
import { Observable } from "rxjs";
import { AppTimers } from "../application/app-timers";
export interface ICronTaskHandler {
  readonly run: () => void | Promise<void>;
  readonly isRunnable?: () => boolean | Promise<boolean>;
}
export class NullCronTaskHandler implements ICronTaskHandler {
  public run() {
    return Promise.resolve();
  }
  public isRunnable() {
    return false;
  }
}
export interface CronDefinition {
  name: string;
  scope: UseCaseScope;
  periodInMinutes: number;
  handler: Class<ICronTaskHandler>;
  mutex?: Mutex;
}
export interface ModuleCronDefinition extends CronDefinition {
  moduleName: string;
}
export abstract class CronLowLevelSource {
  abstract readonly alarm$: Observable<unknown>;
}
const ONE_MINUTE = 60000;
export class TimerBasedCronSource extends CronLowLevelSource {
  readonly alarm$: Observable<unknown>;
  constructor(timers: AppTimers) {
    super();
    this.alarm$ = timers.createObservableTimer(ONE_MINUTE, ONE_MINUTE);
  }
}
