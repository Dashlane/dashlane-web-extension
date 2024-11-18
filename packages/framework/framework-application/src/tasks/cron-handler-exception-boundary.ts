import { INestApplication } from "@nestjs/common";
import { ContextId } from "@nestjs/core";
import { firstValueFrom, map } from "rxjs";
import { getSuccess, isSuccess } from "@dashlane/framework-types";
import { featureFlipsApi } from "@dashlane/framework-contracts";
import { ExceptionLogger } from "../exception-logging/exception-logger";
import { ICronTaskHandler, ModuleCronDefinition } from "./cron.types";
import {
  FrameworkRequestContextValues,
  RequestContext,
} from "../request-context/request-context";
import { ApplicationRequestError } from "../exception-logging/exception-logging.interceptor";
import { UseCaseStacktraceRepository } from "../exception-logging/use-case-stacktrace-repository";
import { CqrsClient } from "../client";
export class CronTaskHandlerExceptionBoundary implements ICronTaskHandler {
  public constructor(
    private handler: ICronTaskHandler,
    private logger: ExceptionLogger,
    private requestContext: RequestContext,
    private definition: ModuleCronDefinition,
    private useCaseStacktraceRepo: UseCaseStacktraceRepository,
    private cqrsClient: CqrsClient
  ) {}
  public static async create(
    nestApp: INestApplication,
    cronContext: ContextId,
    handler: ICronTaskHandler,
    definition: ModuleCronDefinition,
    cqrsClient: CqrsClient
  ) {
    const exceptionLogger = await nestApp.resolve<ExceptionLogger>(
      ExceptionLogger,
      cronContext,
      {
        strict: false,
      }
    );
    const requestContext = await nestApp.resolve<RequestContext>(
      RequestContext,
      cronContext,
      {
        strict: false,
      }
    );
    const useCaseStacktraceRepo =
      await nestApp.resolve<UseCaseStacktraceRepository>(
        UseCaseStacktraceRepository,
        cronContext,
        {
          strict: false,
        }
      );
    return new CronTaskHandlerExceptionBoundary(
      handler,
      exceptionLogger,
      requestContext,
      definition,
      useCaseStacktraceRepo,
      cqrsClient
    );
  }
  public run(): void | Promise<void> {
    try {
      return this.handler.run();
    } catch (exception) {
      void this.captureException(exception);
    }
  }
  public isRunnable() {
    try {
      return this.handler.isRunnable?.() ?? true;
    } catch (exception) {
      void this.captureException(exception);
      return false;
    }
  }
  private async getUserFeatureFlips() {
    const {
      queries: { userFeatureFlips },
    } = this.cqrsClient.getClient(featureFlipsApi);
    return await firstValueFrom(
      userFeatureFlips().pipe(
        map((result) => {
          if (isSuccess(result)) {
            return getSuccess(result);
          }
          throw new Error("Failed to retrieve user featureFlips");
        })
      )
    );
  }
  private async captureException(exception: unknown) {
    const { definition, requestContext, useCaseStacktraceRepo } = this;
    const [unwrappedException, useCaseStacktrace] =
      exception instanceof ApplicationRequestError
        ? [exception.exception, exception.useCaseStacktrace]
        : [exception, useCaseStacktraceRepo.read()];
    this.logger.captureException(unwrappedException, {
      moduleName: definition.moduleName,
      useCaseName: definition.name,
      useCaseId: requestContext.get<string>(
        FrameworkRequestContextValues.UseCaseId
      ),
      featureFlips: await this.getUserFeatureFlips(),
      useCaseStacktrace,
    });
  }
}
