import { Observable, timer } from "rxjs";
import { AppTimers } from "./application/app-timers";
import { AppLogger } from "./application/logger";
import { JsonApplicationResourceFetcher } from "./resources";
export class DefaultLogger extends AppLogger {
  public log() {
    return;
  }
  public warn(message: unknown, ...optionalParams: unknown[]) {
    return console.warn(message, optionalParams);
  }
  public error(message: unknown, ...optionalParams: unknown[]) {
    return console.error(message, optionalParams);
  }
  public trace(message: unknown, ...optionalParams: unknown[]) {
    return console.trace(message, optionalParams);
  }
}
export class VerboseLogger extends AppLogger {
  public log(message: unknown, ...optionalParams: unknown[]) {
    return console.log(message, optionalParams);
  }
  public warn(message: unknown, ...optionalParams: unknown[]) {
    return console.warn(message, optionalParams);
  }
  public error(message: unknown, ...optionalParams: unknown[]) {
    return console.error(message, optionalParams);
  }
  public trace(message: unknown, ...optionalParams: unknown[]) {
    return console.trace(message, optionalParams);
  }
}
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
