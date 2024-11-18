import { HttpModule } from "../http";
import {
  Module,
  ModuleDeclaration,
  ParameterProvider,
} from "../dependency-injection";
import { MV3ExtensionHttpInterceptor } from "./mv3-extension-http-interceptor";
import { MV3ServiceWorkerExtenderBase } from "./mv3-sw-extend-infra";
import { MV3LongRunningTaskInterceptor } from "./mv3-long-running-taks-interceptor";
import { AppModule } from "../application/nest-adapters/app-module";
import { createLoggerProvider } from "../logging";
import { Mv3ExtensionResilienceModuleLogger } from "./mv3-extension-resilience-logger";
@Module({
  sharedModuleName: "mv3ExtensionResilience",
  configurations: {
    mv3SwExtend: {
      token: MV3ServiceWorkerExtenderBase,
    },
  },
  providers: [
    MV3ExtensionHttpInterceptor,
    MV3LongRunningTaskInterceptor,
    createLoggerProvider(Mv3ExtensionResilienceModuleLogger),
  ],
  exports: [MV3ExtensionHttpInterceptor, MV3LongRunningTaskInterceptor],
  domainName: "framework",
})
export class MV3ExtensionResilienceModule {
  static configure(
    mv3SwExtend: ParameterProvider<MV3ServiceWorkerExtenderBase>
  ): ModuleDeclaration {
    HttpModule.addGlobalInterceptor(MV3ExtensionHttpInterceptor);
    AppModule.addGlobalNestInterceptor(MV3LongRunningTaskInterceptor);
    return {
      module: MV3ExtensionResilienceModule,
      configurations: {
        mv3SwExtend,
      },
    };
  }
}
