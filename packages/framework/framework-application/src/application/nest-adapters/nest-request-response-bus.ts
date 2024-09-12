import { ContextId } from "@nestjs/core";
import { REQUEST_CONTEXT_ID } from "@nestjs/core/router/request/request-constants";
import { Result } from "@dashlane/framework-types";
import { Observable } from "rxjs";
import { RequestContext } from "../../request-context/request-context";
export enum PipelineType {
  Command = "command",
  Query = "query",
  Event = "event",
  Init = "init",
  Cron = "cron",
}
export type ApplicationRequestNormalBase = {
  module: string;
  body: unknown;
  name: string;
  context: RequestContext;
};
export type ApplicationRequestCommand = ApplicationRequestNormalBase & {
  type: PipelineType.Command;
};
export type ApplicationRequestQuery = ApplicationRequestNormalBase & {
  type: PipelineType.Query;
};
export type ApplicationRequestEvent = ApplicationRequestNormalBase & {
  type: PipelineType.Event;
};
export type ApplicationRequest =
  | ApplicationRequestCommand
  | ApplicationRequestQuery
  | ApplicationRequestEvent
  | ApplicationCronData;
export type ApplicationInitPipelineData = {
  type: PipelineType.Init;
  [REQUEST_CONTEXT_ID]: ContextId;
};
export type ApplicationCronData = {
  type: PipelineType.Cron;
  module: string;
  name: string;
  context: RequestContext;
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
export const NullApplicationRequest: ApplicationRequest = {
  body: undefined,
  context: new RequestContext(),
  module: "module",
  name: "command",
  type: PipelineType.Command,
};
