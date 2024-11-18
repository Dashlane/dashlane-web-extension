import { Observable, tap } from "rxjs";
import { getFailure, isSuccess } from "@dashlane/framework-types";
import {
  HttpFullResult,
  HttpInterceptor,
  HttpRequest,
} from "@dashlane/framework-services";
import { Mv3ExtensionResilienceModuleLogger } from "../mv3-extension-resilience/mv3-extension-resilience-logger";
import { Injectable } from "../dependency-injection";
@Injectable()
export class LogHttpRequestsInterceptor implements HttpInterceptor {
  constructor(private readonly logger: Mv3ExtensionResilienceModuleLogger) {}
  public readonly id = "LoggingHttpInterceptor";
  intercept<TRequestBody>(
    request: HttpRequest<TRequestBody>,
    next: (request: HttpRequest<TRequestBody>) => Observable<HttpFullResult>
  ): Observable<HttpFullResult> {
    this.logger.info(`HTTP ${request.method} request to ${request.url}`);
    return next(request).pipe(
      tap((result) => {
        if (isSuccess(result)) {
          this.logger.info(`HTTP request to ${request.url} succeeded`);
        } else {
          const failure = getFailure(result);
          if (failure.tag === "BadStatus") {
            this.logger.info(
              `Failure HTTP response from ${request.url} (${
                getFailure(result).tag
              })`
            );
          } else {
            this.logger.info(`Failed to send HTTP request to ${request.url}`);
          }
        }
      })
    );
  }
}
