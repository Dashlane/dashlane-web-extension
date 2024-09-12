import { mergeMap, MonoTypeOperatorFunction, Observable, share } from "rxjs";
import { Injectable } from "../dependency-injection/injectable.decorator";
import { AppTimers } from "../application/app-timers";
import {
  AnyModuleApi,
  BodyOfCommand,
  Client,
  CommandsCalls,
  QueriesContract,
} from "@dashlane/framework-contracts";
import { ContextLessCqrsClient } from "../client/cqrs-client.service";
export interface RefresherCreationToken<
  TApi extends AnyModuleApi = AnyModuleApi,
  TCommandName extends keyof CommandsCalls<
    TApi["commands"]
  > = keyof CommandsCalls<TApi["commands"]>
> {
  api: TApi;
  commandName: TCommandName;
  args: BodyOfCommand<TApi["commands"][TCommandName]>;
  period: number;
}
export function refresherCreationToken<
  TApi extends AnyModuleApi,
  TCommandName extends keyof CommandsCalls<TApi["commands"]>
>(token: RefresherCreationToken<TApi, TCommandName>) {
  return token;
}
export class CqrsCommandRefresher<
  TToken extends RefresherCreationToken = RefresherCreationToken
> {
  private refreshObservable$: Observable<unknown>;
  constructor(
    timer$: Observable<unknown>,
    cqrsClient: Client<TToken["api"]["commands"], QueriesContract>,
    { args, commandName }: TToken
  ) {
    const command = cqrsClient.commands[commandName];
    this.refreshObservable$ = timer$.pipe(
      mergeMap(async () => {
        await command(args);
      }),
      share({})
    );
  }
  public withRefresh<T>(): MonoTypeOperatorFunction<T> {
    return (observable) =>
      new Observable((subscriber) => {
        const subscription = this.refreshObservable$.subscribe();
        subscription.add(observable.subscribe(subscriber));
        return subscription;
      });
  }
}
@Injectable()
export class CommandRefresherFactory {
  constructor(
    private timers: AppTimers,
    private cqrsClient: ContextLessCqrsClient
  ) {}
  private map = new WeakMap();
  public getRefresher<TToken extends RefresherCreationToken>(
    token: TToken
  ): CqrsCommandRefresher<TToken> {
    const value = this.map.get(token);
    if (value) {
      return value;
    }
    const created = new CqrsCommandRefresher<TToken>(
      this.timers.createObservableTimer(token.period, token.period),
      this.cqrsClient.getClient(token.api),
      token
    );
    return created;
  }
}
