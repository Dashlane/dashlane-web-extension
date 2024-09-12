import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Scope,
} from "@nestjs/common";
import { firstValueFrom, Observable, throwError } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";
import {
  featureFlipsApi,
  RequestContextClient,
} from "@dashlane/framework-contracts";
import { getSuccess, isSuccess } from "@dashlane/framework-types";
import { ApplicationRequest } from "../../application/nest-adapters/nest-request-response-bus";
import { FrameworkRequestContextValues } from "../../request-context/request-context";
import { ExceptionLogger } from "./exception-logger";
import { UseCaseStacktraceRepository } from "./use-case-stacktrace-repository";
import { CqrsClient } from "../../client/cqrs-client.service";
import { NodeModulesIntrospection } from "../../dependency-injection/module.types";
export class ApplicationRequestError extends Error {
  constructor(public exception: unknown, public useCaseStacktrace: string[]) {
    super("ApplicationRequestError");
  }
}
let VERBOSE_REQUEST_PIPELINE_LOGS = true;
export function disableVerbosePipelineLogs() {
  VERBOSE_REQUEST_PIPELINE_LOGS = false;
}
@Injectable({ scope: Scope.REQUEST })
export class ExceptionLoggingInterceptor implements NestInterceptor {
  public constructor(
    private logger: ExceptionLogger,
    private useCaseStacktraceRepo: UseCaseStacktraceRepository,
    private cqrsClient: CqrsClient,
    private requestContextClient: RequestContextClient,
    private nodeModulesIntrospection: NodeModulesIntrospection
  ) {}
  public intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<unknown> {
    const request = context.getArgByIndex<ApplicationRequest>(0);
    if (VERBOSE_REQUEST_PIPELINE_LOGS) {
      console.log(
        `[background/framework] Processing incoming request (name: ${request.name}, type: ${request.type})`
      );
    }
    return next.handle().pipe(
      tap(() => {
        if (VERBOSE_REQUEST_PIPELINE_LOGS) {
          console.log(
            `[background/framework] Done processing incoming request (name: ${request.name}, type: ${request.type})`
          );
        }
      }),
      catchError(this.handleException(request))
    );
  }
  private handleException(request: ApplicationRequest) {
    const { useCaseStacktraceRepo } = this;
    return (exception: unknown) => {
      console.error(
        `[background/framework] Error wile processing incoming request (name: ${request.name}, type: ${request.type})`,
        exception
      );
      if (useCaseStacktraceRepo.isInitialUseCase()) {
        const [unwrappedException, useCaseStacktrace] =
          exception instanceof ApplicationRequestError
            ? [exception.exception, exception.useCaseStacktrace]
            : [exception, useCaseStacktraceRepo.read()];
        this.captureException(request, unwrappedException, useCaseStacktrace);
        return throwError(() => unwrappedException);
      }
      const wrappedException =
        exception instanceof ApplicationRequestError
          ? exception
          : new ApplicationRequestError(
              exception,
              useCaseStacktraceRepo.read()
            );
      return throwError(() => wrappedException);
    };
  }
  private async getUserFeatureFlips() {
    const userLoggedIn = await firstValueFrom(
      this.requestContextClient.queries
        .activeUser()
        .pipe(
          map(
            (activerUser) =>
              isSuccess(activerUser) && !!getSuccess(activerUser).userName
          )
        )
    );
    if (!userLoggedIn) {
      return Promise.resolve({});
    }
    const {
      queries: { userFeatureFlips },
    } = this.cqrsClient.getClient(featureFlipsApi);
    return await firstValueFrom(
      userFeatureFlips().pipe(
        map((result) => {
          if (isSuccess(result)) {
            return getSuccess(result);
          }
          return {};
        })
      )
    );
  }
  private async captureException(
    request: ApplicationRequest,
    exception: unknown,
    useCaseStacktrace: string[]
  ) {
    const moduleName = request.module;
    const domainName =
      this.nodeModulesIntrospection.modules[moduleName].domainName ?? "unknown";
    void this.logger.captureException(exception, {
      domainName,
      moduleName,
      useCaseName: request.name,
      useCaseId: request.context.get<string>(
        FrameworkRequestContextValues.UseCaseId
      ),
      featureFlips: await this.getUserFeatureFlips(),
      useCaseStacktrace,
    });
  }
}
