import { Provider, Scope } from "@nestjs/common";
import { ContextIdFactory, REQUEST } from "@nestjs/core";
import {
  ApplicationPipelineData,
  PipelineType,
} from "./nest-request-response-bus";
import { assertUnreachable } from "@dashlane/framework-types";
import {
  FrameworkRequestContextValues,
  RequestContext,
} from "../../request-context/request-context";
export const RequestContextProvider: Provider = {
  provide: RequestContext,
  scope: Scope.REQUEST,
  inject: [REQUEST],
  useFactory: (request: ApplicationPipelineData) => {
    const createContext = () => {
      switch (request.type) {
        case PipelineType.Command:
        case PipelineType.Event:
        case PipelineType.Query:
        case PipelineType.Cron:
          return request.context;
        case PipelineType.Init:
          return new RequestContext();
        default:
          assertUnreachable(request);
      }
    };
    const context = createContext();
    context.getOrAdd(FrameworkRequestContextValues.UseCaseId, () =>
      String(ContextIdFactory.getByRequest(request).id)
    );
    return context;
  },
};
