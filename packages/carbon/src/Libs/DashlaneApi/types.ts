import { StoreService } from "Store";
import {
  BusinessError,
  InjectedError,
  InvalidRequestError,
  RateLimitError,
  ServerError,
} from "Libs/DashlaneApi/services";
export type ApiAuthType =
  | "App"
  | "UserDevice"
  | "None"
  | "Session"
  | "TeamDevice";
export const ApiAuthType = {
  App: "App",
  UserDevice: "UserDevice",
  None: "None",
  Session: "Session",
  TeamDevice: "TeamDevice",
} as const;
export type ApiRequestMethod = "GET" | "POST";
export const ApiRequestMethod = {
  GET: "GET" as const,
  POST: "POST" as const,
};
export type EmptyPayload = {
  [key: string]: never;
};
export enum ApiVersion {
  v1,
}
export enum ApiEndpointGroups {
  abtesting = "abtesting",
  account = "account",
  accountRecovery = "accountrecovery",
  authentication = "authentication",
  breachesQA = "breaches-qa",
  dataleak = "dataleak",
  dataleakQA = "dataleak-qa",
  darkwebinsights = "darkwebinsights",
  devices = "devices",
  familyplan = "familyplan",
  features = "features",
  file = "file",
  killswitch = "killswitch",
  pairing = "pairing",
  premium = "premium",
  pwleak = "pwleak",
  sync = "sync",
  teams = "teams",
  time = "time",
  payments = "payments",
  vpn = "vpn",
}
export type ApiResponse<Success extends {}, Err extends string = string> =
  | ApiSuccess<Success>
  | ApiError<Err>;
type AddSuccessCode<Success extends {}> = Success & {
  code: "success";
};
export type ApiSuccess<Success extends {}> = {
  [P in keyof AddSuccessCode<Success>]: AddSuccessCode<Success>[P];
};
export const UnknownError = "UNKNOWN_ERROR" as const;
export type UnknownErrorType = typeof UnknownError;
export type ApiError<BusinessErrorCode extends string = string> =
  | ApiErrorBase<string & BusinessErrorCode, typeof BusinessError>
  | ApiErrorBase<string, Exclude<ApiErrorType, typeof BusinessError>>;
export type ApiErrorType =
  | typeof BusinessError
  | typeof InjectedError
  | typeof InvalidRequestError
  | typeof RateLimitError
  | typeof ServerError;
export function isApiError<T extends string = string>(
  response: any
): response is ApiError<T> {
  return typeof response === "object" && response.code !== "success";
}
export function isApiErrorOfType<T extends ApiErrorType>(
  type: T,
  error: any
): error is ApiErrorBase<any, T> {
  return typeof error === "object" && error.type === type;
}
export interface ApiErrorBase<Code extends string, Type extends string> {
  code: Code;
  message: string;
  type: Type;
}
export type ApiRequestParams<
  AuthType extends ApiAuthType,
  Method extends ApiRequestMethod,
  Payload extends {}
> = (AuthType extends "UserDevice" | "Session"
  ? {
      login: string;
    }
  : {}) &
  (AuthType extends "TeamDevice"
    ? {
        login: string;
        teamUuid: string;
      }
    : {}) &
  (Method extends "POST"
    ? {
        payload: Payload;
      }
    : {});
export type MakeApiRequest<
  Method extends ApiRequestMethod,
  AuthType extends ApiAuthType
> = Method extends "GET"
  ? AuthType extends "App" | "None"
    ? <Success extends {}, Err extends string = string>(
        storeService: StoreService
      ) => Promise<ApiResponse<Success, Err>>
    : <Success extends {}, Err extends string = string>(
        storeService: StoreService,
        params: ApiRequestParams<AuthType, Method, never>
      ) => Promise<ApiResponse<Success, Err>>
  : AuthType extends "App" | "None"
  ? <Payload extends {}, Success extends {}, Err extends string = string>(
      storeService: StoreService,
      params: ApiRequestParams<AuthType, Method, Payload>
    ) => Promise<ApiResponse<Success, Err>>
  : <Payload extends {}, Success extends {}, Err extends string = string>(
      storeService: StoreService,
      params: ApiRequestParams<AuthType, Method, Payload>
    ) => Promise<ApiResponse<Success, Err>>;
export type MethodParams<Payload extends {}> =
  | {
      method: "GET";
    }
  | {
      method: "POST";
      payload: Payload;
    };
export type AuthParams =
  | {
      authenticationType: "None" | "App";
    }
  | {
      authenticationType: "UserDevice" | "Session";
      login: string;
    }
  | {
      authenticationType: "TeamDevice";
      teamUuid: string;
    };
