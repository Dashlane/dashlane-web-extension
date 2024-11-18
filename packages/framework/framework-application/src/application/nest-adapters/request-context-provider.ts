import { Provider, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import {
  ApplicationPipelineData,
  PipelineType,
} from "./nest-request-response-bus";
import { assertUnreachable } from "@dashlane/framework-types";
import { RequestContext } from "../../request-context/request-context";
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
        case PipelineType.Init:
          return request.context;
        default:
          assertUnreachable(request);
      }
    };
    const context = createContext();
    return context;
  },
};
