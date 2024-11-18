import { Class } from "@dashlane/framework-types";
import { INestApplication } from "@nestjs/common";
import { ContextId } from "@nestjs/core";
import { REQUEST_CONTEXT_ID } from "@nestjs/core/router/request/request-constants.js";
import { OnFrameworkInit } from "../../dependency-injection/module.types";
import {
  ApplicationInitPipelineData,
  PipelineType,
} from "./nest-request-response-bus";
import {
  ExceptionCriticalityValues,
  ExceptionLogger,
} from "../../exception-logging";
import {
  FrameworkRequestContextValues,
  RequestContext,
} from "../../request-context/request-context";
import { AppLogger } from "../../logging";
export async function doFrameworkInit(
  onFrameworkInits: {
    moduleName: string;
    initClass: Class<OnFrameworkInit>;
  }[],
  nestApp: INestApplication,
  exceptionLogger: ExceptionLogger,
  logger: AppLogger
): Promise<void> {
  logger.debug(" Run modules initialization handlers...");
  const initContext: ContextId = Object.freeze({ id: -1 });
  const initPromises = onFrameworkInits.map(
    async ({ moduleName, initClass }) => {
      try {
        logger.debug(`Running module initialization handler ${moduleName}`);
        const request: ApplicationInitPipelineData = {
          type: PipelineType.Init,
          [REQUEST_CONTEXT_ID]: initContext,
          module: moduleName,
          name: "init",
          context: new RequestContext().withValue(
            FrameworkRequestContextValues.UseCaseId,
            String(initContext.id)
          ),
        };
        nestApp.registerRequestByContextId(request, initContext);
        const instance = await nestApp.resolve<OnFrameworkInit>(
          initClass,
          initContext,
          {
            strict: false,
          }
        );
        await instance.onFrameworkInit();
        logger.debug(
          `Done running module initialization handler ${moduleName}`
        );
      } catch (causeError) {
        const error = new Error(
          `Failed running module initialization handler ${moduleName}`,
          {
            cause: causeError,
          }
        );
        logger.debug(` ${error.message}`, { cause: causeError });
        void exceptionLogger.captureException(
          error,
          {
            origin: "exceptionBoundary",
            moduleName: "kernel",
            domainName: "framework",
          },
          ExceptionCriticalityValues.CRITICAL
        );
      }
    }
  );
  await Promise.all(initPromises);
  logger.debug("Done running modules initialization handlers");
}
