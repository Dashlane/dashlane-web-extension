import { ModuleRef } from "@nestjs/core";
import { ClassImplementing } from "@dashlane/framework-types";
import { HttpBackend, HttpInterceptor } from "@dashlane/framework-services";
import { HttpClient } from "./http-client";
import {
  Module,
  ModuleDeclaration,
  ParameterProvider,
} from "../dependency-injection";
const GLOBAL_HTTP_INTERCEPTOR_PROVIDERS: ClassImplementing<HttpInterceptor>[] =
  [];
@Module({
  providers: [
    {
      asyncFactory: async (backend: HttpBackend, moduleRef: ModuleRef) => {
        const client = new HttpClient(backend);
        const globalInterceptors = await Promise.all(
          GLOBAL_HTTP_INTERCEPTOR_PROVIDERS.map((provider) => {
            return moduleRef.create(provider);
          })
        );
        globalInterceptors.forEach((interceptor) =>
          client.addInterceptor(interceptor)
        );
        return client;
      },
      token: HttpClient,
      inject: [HttpBackend, ModuleRef],
    },
  ],
  configurations: {
    infrastructure: {
      token: HttpBackend,
    },
  },
  exports: [HttpClient],
  sharedModuleName: "http",
  domainName: "framework",
})
export class HttpModule {
  public static configure(
    backend: ParameterProvider<HttpBackend>
  ): ModuleDeclaration {
    return {
      module: HttpModule,
      configurations: {
        infrastructure: backend,
      },
    };
  }
  public static addGlobalInterceptor(
    interceptorClass: ClassImplementing<HttpInterceptor>
  ) {
    GLOBAL_HTTP_INTERCEPTOR_PROVIDERS.push(interceptorClass);
  }
}
