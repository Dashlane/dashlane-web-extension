import { Observable, shareReplay, take, takeUntil } from "rxjs";
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { AppTimers, MV3ServiceWorkerExtenderBase } from "..";
import {
  ApplicationRequest,
  PipelineType,
} from "../application/nest-adapters/nest-request-response-bus";
const SW_MAX_LIFETIME_EXTENSION = 15 * 60000;
const SWLONG_RUNNING_CALCULATION_HEARTBEAT = 20000;
@Injectable()
export class MV3LongRunningTaskInterceptor implements NestInterceptor {
  public constructor(
    private readonly timers: AppTimers,
    private readonly mv3ServiceWorkerExtender: MV3ServiceWorkerExtenderBase
  ) {}
  public intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<unknown> {
    const request = context.switchToHttp().getRequest() as ApplicationRequest;
    if (
      request.type === PipelineType.Command ||
      request.type === PipelineType.Cron ||
      request.type === PipelineType.Event
    ) {
      const result$ = next.handle().pipe(shareReplay(1));
      this.timers
        .createObservableTimer(
          SWLONG_RUNNING_CALCULATION_HEARTBEAT,
          SWLONG_RUNNING_CALCULATION_HEARTBEAT
        )
        .pipe(
          takeUntil(result$),
          take(
            Math.trunc(
              SW_MAX_LIFETIME_EXTENSION / SWLONG_RUNNING_CALCULATION_HEARTBEAT
            )
          )
        )
        .subscribe(() =>
          this.mv3ServiceWorkerExtender.extendServiceWorkerLifetime()
        );
      return result$;
    }
    return next.handle();
  }
}
