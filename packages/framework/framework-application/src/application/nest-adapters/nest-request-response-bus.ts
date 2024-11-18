import { type ContextId } from "@nestjs/core";
import { ContextIdFactory } from "@nestjs/core/helpers/context-id-factory.js";
import { REQUEST_CONTEXT_ID } from "@nestjs/core/router/request/request-constants.js";
import { Result } from "@dashlane/framework-types";
import { Observable } from "rxjs";
import {
  FrameworkRequestContextValues,
  RequestContext,
} from "../../request-context/request-context";
export enum PipelineType {
  Command = "command",
  Query = "query",
  Event = "event",
  Init = "init",
  Cron = "cron",
}
export type ApplicationRequestNormalBase = {
  module: string;
  name: string;
  context: RequestContext;
  [REQUEST_CONTEXT_ID]: ContextId;
};
export type ApplicationRequestCommand = ApplicationRequestNormalBase & {
  type: PipelineType.Command;
  body: unknown;
};
export type ApplicationRequestQuery = ApplicationRequestNormalBase & {
  type: PipelineType.Query;
  body: unknown;
};
export type ApplicationRequestEvent = ApplicationRequestNormalBase & {
  type: PipelineType.Event;
  body: unknown;
};
export type ApplicationRequest =
  | ApplicationRequestCommand
  | ApplicationRequestQuery
  | ApplicationRequestEvent
  | ApplicationCronData;
export type ApplicationInitPipelineData = ApplicationRequestNormalBase & {
  type: PipelineType.Init;
};
export type ApplicationCronData = ApplicationRequestNormalBase & {
  type: PipelineType.Cron;
};
export type ApplicationPipelineData =
  | ApplicationRequest
  | ApplicationInitPipelineData;
export interface QueryPipelineResult {
  result: Observable<Result<unknown, unknown>>;
}
export interface CommandPipelineResult {
  result: Result<unknown, unknown>;
}
export interface CronPipelineResult {
  result: boolean;
}
export type ApplicationResponse =
  | {
      type: PipelineType.Query;
      value: QueryPipelineResult;
      reply: (value: QueryPipelineResult["result"]) => void;
      fail: (exception: Error) => void;
    }
  | {
      type: PipelineType.Command;
      value: CommandPipelineResult;
      reply: (value: CommandPipelineResult["result"]) => void;
      fail: (exception: Error) => void;
    }
  | {
      type: PipelineType.Event;
      reply: () => void;
      fail: (exception: Error) => void;
    }
  | {
      type: PipelineType.Cron;
      value: CronPipelineResult;
      reply: (value: boolean) => void;
      fail: (exception: Error) => void;
    };
const NullApplicationRequestContextId = ContextIdFactory.create();
export const NullApplicationRequest: ApplicationRequest = {
  body: undefined,
  context: new RequestContext().withValue(
    FrameworkRequestContextValues.UseCaseId,
    String(NullApplicationRequestContextId.id)
  ),
  module: "module",
  name: "command",
  type: PipelineType.Command,
  [REQUEST_CONTEXT_ID]: NullApplicationRequestContextId,
};
