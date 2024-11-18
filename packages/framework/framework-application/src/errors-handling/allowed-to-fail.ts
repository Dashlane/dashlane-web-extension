import { REQUEST } from "@nestjs/core";
import { Inject } from "@nestjs/common";
import { catchError, firstValueFrom, map, of, timeout } from "rxjs";
import { FeatureFlipsClient } from "@dashlane/framework-contracts";
import {
  getSuccess,
  isFailure,
  isResult,
  isSuccess,
} from "@dashlane/framework-types";
import { ApplicationRequest } from "../application/nest-adapters/nest-request-response-bus";
import {
  type ExceptionCriticality,
  ExceptionCriticalityValues,
} from "../exception-logging/exception-logging.types";
import { ExceptionLogger } from "../exception-logging/exception-logger";
import { FrameworkRequestContextValues } from "../request-context/request-context";
import { ApplicationRequestError } from "../exception-logging/exception-logging.interceptor";
import { UseCaseStacktraceRepository } from "../exception-logging/use-case-stacktrace-repository";
type MethodToProtect = () => Promise<unknown> | unknown;
type Options = {
  methodName?: string;
  criticality?: ExceptionCriticality;
};
export class AllowedToFail {
  constructor(
    @Inject(REQUEST)
    private request: ApplicationRequest | undefined,
    private readonly logger: ExceptionLogger,
    private readonly useCaseStacktraceRepo: UseCaseStacktraceRepository,
    private readonly featureFlips: FeatureFlipsClient
  ) {}
  public async do(
    options?: Options,
    ...functions: MethodToProtect[]
  ): Promise<boolean> {
    const result = await Promise.all(
      functions.map((fn) => this.doOne(fn, options))
    );
    return result.every((r) => !!r);
  }
  public async doOne(
    fn: MethodToProtect,
    {
      criticality = ExceptionCriticalityValues.WARNING,
      methodName = "methodName",
    }: Options = {}
  ): Promise<boolean> {
    try {
      const result = await fn();
      if (isResult(result)) {
        if (isFailure(result)) {
          throw new Error(`Allowed to fail ${methodName} has failed`);
        }
      }
      return true;
    } catch (exception) {
      const { request, useCaseStacktraceRepo } = this;
      const [unwrappedException, useCaseStacktrace] =
        exception instanceof ApplicationRequestError
          ? [exception.exception, exception.useCaseStacktrace]
          : [exception, useCaseStacktraceRepo.read()];
      try {
        await Promise.race([
          new Promise((resolve) => setTimeout(resolve, 100)),
          this.logger.captureException(
            unwrappedException,
            {
              moduleName: request?.module,
              useCaseId: request?.context.get<string>(
                FrameworkRequestContextValues.UseCaseId
              ),
              useCaseName: request?.name,
              useCaseStacktrace,
              featureFlips: await this.getUserFeatureFlips(),
            },
            criticality
          ),
        ]);
      } catch (error) {}
      return false;
    }
  }
  public async conditionallyAllowToFailOne(
    fn: MethodToProtect,
    condition: boolean
  ): Promise<boolean> {
    if (condition) {
      return this.doOne(fn);
    }
    await fn();
    return true;
  }
  private getUserFeatureFlips() {
    const { userFeatureFlips } = this.featureFlips.queries;
    return firstValueFrom(
      userFeatureFlips().pipe(
        map((result) => {
          if (isSuccess(result)) {
            return getSuccess(result);
          }
          return {};
        }),
        timeout(50),
        catchError(() => of({}))
      )
    );
  }
}
