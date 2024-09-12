import {
  BehaviorSubject,
  filter,
  firstValueFrom,
  map,
  Observable,
  Subscriber,
} from "rxjs";
export abstract class AppTimers {
  public abstract createObservableTimer(
    start: number,
    period: number
  ): Observable<number>;
  public async waitTimeout(timeout: number): Promise<void> {
    await firstValueFrom(this.createObservableTimer(timeout, timeout));
  }
  public abstract get time(): number;
}
export class ManualTriggeredTimers extends AppTimers {
  private subscribers$ = new BehaviorSubject(new Set<Subscriber<number>>());
  public time = 0;
  public pendingTimerCount$ = this.subscribers$.pipe(map((s) => s.size));
  public fireTimer(timeAdvance = 1): void {
    this.time += timeAdvance;
    [...this.subscribers$.value].forEach((subscriber) => {
      subscriber.next(this.time);
    });
  }
  public async allSubscribersDisconnected(): Promise<void> {
    await firstValueFrom(this.pendingTimerCount$.pipe(filter((x) => !x)));
  }
  public createObservableTimer(): Observable<number> {
    return new Observable((subscriber) => {
      this.subscribers$.next(new Set([...this.subscribers$.value, subscriber]));
      return () => {
        this.subscribers$.next(
          new Set([...this.subscribers$.value].filter((x) => x !== subscriber))
        );
      };
    });
  }
}
