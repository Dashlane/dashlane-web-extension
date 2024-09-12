import { Observable, shareReplay, take, takeUntil } from "rxjs";
import { Injectable } from "@nestjs/common";
import {
  HttpFullResult,
  HttpInterceptor,
  HttpRequest,
} from "@dashlane/framework-services";
import { AppTimers } from "../application";
import { MV3ServiceWorkerExtenderBase } from "./mv3-sw-extend-infra";
const SW_TIMEOUT_MILLISECONDS = 30000;
const SW_HEARTBEAT = 20000;
@Injectable()
export class MV3ExtensionHttpInterceptor implements HttpInterceptor {
  public constructor(
    private readonly timers: AppTimers,
    private readonly mv3ServiceWorkerExtender: MV3ServiceWorkerExtenderBase
  ) {}
  public id = "MV3ExtensionHttpInterceptor";
  public intercept<TRequestBody>(
    request: HttpRequest<TRequestBody>,
    next: (request: HttpRequest<TRequestBody>) => Observable<HttpFullResult>
  ): Observable<HttpFullResult> {
    if (request.timeout < SW_TIMEOUT_MILLISECONDS) {
      return next(request);
    }
    const result$ = next(request).pipe(shareReplay(1));
    this.timers
      .createObservableTimer(SW_HEARTBEAT, SW_HEARTBEAT)
      .pipe(
        takeUntil(result$),
        take(Math.trunc(request.timeout / SW_HEARTBEAT))
      )
      .subscribe(() =>
        this.mv3ServiceWorkerExtender.extendServiceWorkerLifetime()
      );
    return result$;
  }
}
