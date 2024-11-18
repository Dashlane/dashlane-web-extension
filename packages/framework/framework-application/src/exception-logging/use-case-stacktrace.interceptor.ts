import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
  Scope,
} from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Observable } from "rxjs";
import {
  ApplicationCronData,
  ApplicationRequest,
} from "../application/nest-adapters/nest-request-response-bus";
import { UseCaseStacktraceRepository } from "./use-case-stacktrace-repository";
@Injectable({ scope: Scope.REQUEST })
export class UseCaseStacktraceInterceptor implements NestInterceptor {
  public constructor(
    @Inject(REQUEST)
    private request: ApplicationRequest | ApplicationCronData,
    private useCaseStacktraceRepo: UseCaseStacktraceRepository
  ) {}
  public intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<unknown> {
    this.useCaseStacktraceRepo.append(this.request.name);
    return next.handle();
  }
}
