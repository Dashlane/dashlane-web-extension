import { BrowseComponent, Event, PageView } from "@dashlane/hermes";
export interface LogEventParam {
  event: Event;
}
export enum StyxApiResult {
  AllBatchesSent,
  SomeBatchesSent,
  NoBatchesSent,
}
export type LogEventResult = LogEventSuccess | LogEventError;
export interface LogEventSuccess {
  success: true;
  result: StyxApiResult;
}
export interface LogEventError {
  success: false;
  result: StyxApiResult;
}
export interface LogPageViewParam {
  pageView: PageView;
  browseComponent?: BrowseComponent;
}
