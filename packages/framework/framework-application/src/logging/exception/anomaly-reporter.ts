import { catchError, firstValueFrom, map, of, timeout } from "rxjs";
import { Inject, Injectable } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { getSuccess, isSuccess } from "@dashlane/framework-types";
import {
  AnomalyTypeValues,
  FeatureFlipsClient,
} from "@dashlane/framework-contracts";
import { AppLogger } from "../../application/logger";
import { ExceptionLoggingSink } from "./exception-logging.infra";
import { ApplicationRequest } from "../../application/nest-adapters/nest-request-response-bus";
import { FrameworkRequestContextValues } from "../../request-context";
import { ReportAnomalyParams } from "./anomaly-reporter.types";
@Injectable()
export class AnomalyReporter {
  public constructor(
    private readonly sink: ExceptionLoggingSink,
    private readonly logger: AppLogger,
    private readonly featureFlips: FeatureFlipsClient,
    @Inject(REQUEST)
    private readonly request: ApplicationRequest | undefined
  ) {}
  public async report(params: ReportAnomalyParams): Promise<void> {
    const moduleName = params.moduleNameOverride ?? this.request?.module;
    const useCaseName = params.useCaseNameOverride ?? this.request?.name;
    const useCaseId =
      params.useCaseIdOverride ??
      this.request?.context.get<string>(
        FrameworkRequestContextValues.UseCaseId
      );
    const featuresFlipped = await this.getUserFeatureFlips();
    try {
      const timestamp = Date.now();
      const anomalyEvent =
        params.anomalyType === AnomalyTypeValues.EXCEPTION
          ? {
              callStack: params.callStack,
              criticality: params.criticality,
              featuresFlipped,
              fileLocation: params.fileLocation,
              lineNumber: params.lineNumber,
              message: params.message,
              moduleName,
              origin: params.origin,
              timestamp,
              useCaseId,
              useCaseName,
              useCaseStacktrace: params.useCaseStacktrace,
            }
          : {
              criticality: params.criticality,
              featuresFlipped,
              message: params.message,
              timestamp,
            };
      await this.sink.logException(anomalyEvent);
    } catch (err) {
      this.logger.error("Failed to report anomaly", params);
    }
    return Promise.resolve();
  }
  private async getUserFeatureFlips() {
    if (this.cachedFeatureFlips) {
      return this.cachedFeatureFlips;
    }
    const { userFeatureFlips } = this.featureFlips.queries;
    const featureFlips = await firstValueFrom(
      userFeatureFlips().pipe(
        map((result) => {
          if (isSuccess(result)) {
            return getSuccess(result);
          }
          return {};
        }),
        timeout(50),
        catchError(() => of({} as Record<string, never>))
      )
    );
    this.cachedFeatureFlips = Object.keys(featureFlips).filter(
      (featureName) => !!featureFlips[featureName]
    );
  }
  private cachedFeatureFlips: Array<string> | undefined = undefined;
}
