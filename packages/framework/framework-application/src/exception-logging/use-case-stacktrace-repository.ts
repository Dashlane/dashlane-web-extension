import { Injectable } from "@nestjs/common";
import { RequestContext } from "../request-context/request-context";
export const USE_CASE_STACKTRACE_REQUEST_CONTEXT_KEY = "USE_CASE_STACKTRACE";
@Injectable()
export class UseCaseStacktraceRepository {
  constructor(private requestContext: RequestContext) {}
  public isInitialUseCase() {
    const currentValue =
      this.requestContext.get<string[]>(
        USE_CASE_STACKTRACE_REQUEST_CONTEXT_KEY
      ) ?? [];
    return currentValue.length <= 1;
  }
  public read(): string[] {
    return this.requestContext.getOrAddSync<string[]>(
      USE_CASE_STACKTRACE_REQUEST_CONTEXT_KEY,
      () => []
    );
  }
  public append(newUseCaseName: string) {
    const { requestContext } = this;
    const currentValue =
      requestContext.get<string[]>(USE_CASE_STACKTRACE_REQUEST_CONTEXT_KEY) ??
      [];
    requestContext.set<string[]>(USE_CASE_STACKTRACE_REQUEST_CONTEXT_KEY, [
      ...currentValue,
      newUseCaseName,
    ]);
  }
}
export const NullUseCaseStacktraceRepository = new UseCaseStacktraceRepository(
  new RequestContext()
);
