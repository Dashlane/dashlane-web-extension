import { ErrorType, LibErrorAdditionalInfo } from "Libs/Error/types";
import { UnknownError, UnknownErrorCode } from "Libs/Error/UnknownError";
export class CarbonError<
  ErrorCodeEnum extends number,
  EAI extends LibErrorAdditionalInfo = Record<string, string>
> extends Error {
  private additionalInfo: EAI = {} as EAI;
  public constructor(
    public errorType: ErrorType,
    public errorCode: ErrorCodeEnum
  ) {
    super(errorType.messages[errorCode]);
    Object.setPrototypeOf(this, CarbonError.prototype);
    this.name = "CarbonError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CarbonError);
    }
  }
  public errorTypeName(): string {
    return this.errorType.name;
  }
  public stringErrorCode(): string {
    const {
      errorType: { codes, name },
      errorCode,
    } = this;
    return `${name}#${codes[errorCode]}`;
  }
  public addAdditionalInfo(data: EAI): this {
    this.additionalInfo = {
      ...this.additionalInfo,
      ...data,
    };
    return this;
  }
  public getAdditionalInfo(): EAI {
    return this.additionalInfo;
  }
  public addContextInfo(topic: string, location: string): this {
    const { errorCode, errorType } = this;
    this.message = `[${topic}] - ${location}: ${errorType.messages[errorCode]}`;
    return this;
  }
  public toString(): string {
    return `CarbonError: ${this.message} (code ${this.stringErrorCode()})`;
  }
  public static fromAnyError<ErrorCodeEnum extends number = UnknownErrorCode>(
    error: any,
    errorType?: ErrorType,
    errorCode?: ErrorCodeEnum
  ): CarbonError<any> {
    if (isCarbonError(error)) {
      return error;
    }
    const carbonError = new CarbonError<any>(
      errorType || UnknownError,
      errorCode === undefined ? UnknownErrorCode.UNKNOWN_ERROR : errorCode
    );
    if (
      isCarbonError(carbonError, UnknownError, UnknownErrorCode.UNKNOWN_ERROR)
    ) {
      carbonError.message = error.message || `${error}`;
    }
    if (error.stack) {
      carbonError.stack = error.stack;
    }
    return carbonError;
  }
}
export function isCarbonError<
  ErrorCodeEnum extends number,
  EAI extends LibErrorAdditionalInfo = Record<string, string>
>(
  error: any,
  errorType?: ErrorType,
  errorCode?: ErrorCodeEnum
): error is CarbonError<ErrorCodeEnum, EAI> {
  return (
    error instanceof Error &&
    error.name === "CarbonError" &&
    (errorType === undefined ||
      errorType === (error as CarbonError<any>).errorType) &&
    (errorCode === undefined ||
      errorCode === (error as CarbonError<any>).errorCode)
  );
}
export * from "Libs/Error/types";
