export interface WSRequestParams {
  login: string;
  uki: string;
}
export interface WSRequestTeamParams extends WSRequestParams {
  teamId: number;
}
export interface WSResponseBase {
  code: number;
  content?: any;
  message: string;
}
export interface WSResponseError extends WSResponseBase {
  content: {
    error: string;
  };
}
export interface WSResponseSuccess<T> extends WSResponseBase {
  content?: T;
}
export type WSResponse<T> = WSResponseError | WSResponseSuccess<T>;
