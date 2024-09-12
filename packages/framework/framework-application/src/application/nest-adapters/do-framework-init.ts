import { Class } from "@dashlane/framework-types";
import { INestApplication } from "@nestjs/common";
import { ContextId } from "@nestjs/core";
import { REQUEST_CONTEXT_ID } from "@nestjs/core/router/request/request-constants.js";
import { OnFrameworkInit } from "../../dependency-injection/module.types";
import {
  ApplicationPipelineData,
  PipelineType,
} from "./nest-request-response-bus";
export async function doFrameworkInit(
  onFrameworkInits: {
    moduleName: string;
    initClass: Class<OnFrameworkInit>;
  }[],
  nestApp: INestApplication
): Promise<void> {
  console.log("[background/framework] Run modules initialization handlers...");
  const initContext: ContextId = Object.freeze({ id: -1 });
  const initPromises = onFrameworkInits.map(
    async ({ moduleName, initClass }) => {
      try {
        console.log(
          `[background/framework] Running module initialization handler ${moduleName}`
        );
        const request: ApplicationPipelineData = {
          type: PipelineType.Init,
          [REQUEST_CONTEXT_ID]: initContext,
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
        console.log(
          `[background/framework] Done running module initialization handler ${moduleName}`
        );
      } catch (error) {
        console.error(
          `[background/framework] Failed running module initialization handler ${moduleName}`,
          error
        );
        throw error;
      }
    }
  );
  await Promise.all(initPromises);
  console.log(
    "[background/framework] Done running modules initialization handlers"
  );
}
