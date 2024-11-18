import { Observable, timer } from "rxjs";
import { AppTimers } from "./application/app-timers";
import { JsonApplicationResourceFetcher } from "./resources";
export class DefaultTimers extends AppTimers {
  public get time(): number {
    return Date.now();
  }
  createObservableTimer(start: number, period: number): Observable<number> {
    return timer(start, period);
  }
}
export class ThrowJsonFetcher extends JsonApplicationResourceFetcher {
  public fetch(): Promise<unknown> {
    return Promise.reject(
      new Error(
        "Please add a jsonFetcher to the application. Probably you are seing that in unit tests.\n" +
          "If this is the case, please mock whatever service is requiring to fetch the data"
      )
    );
  }
}
