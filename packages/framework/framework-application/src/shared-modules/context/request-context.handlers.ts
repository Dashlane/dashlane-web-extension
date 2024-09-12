import { Result, success } from "@dashlane/framework-types";
import {
  ActiveUserQuery,
  SetActiveUserCommand,
} from "@dashlane/framework-contracts";
import { distinctUntilChanged, map } from "rxjs";
import { ActiveUserStore } from "./request-context.store";
import { QueryHandler } from "../../cqrs/queries.decorators";
import { IQueryHandler } from "../../cqrs/queries.types";
import { ICommandHandler } from "../../cqrs/commands.types";
import { CommandHandler } from "../../cqrs/commands.decorators";
import { RequestContextEventsEmitter } from "./events-emitter";
import { disableVerbosePipelineLogs } from "../../logging/exception/exception-logging.interceptor";
@QueryHandler(ActiveUserQuery)
export class ActiveUserHandler implements IQueryHandler<ActiveUserQuery> {
  constructor(private activeUserStore: ActiveUserStore) {}
  public execute() {
    disableVerbosePipelineLogs();
    return this.activeUserStore.state$.pipe(
      map((x) => x.userName),
      distinctUntilChanged(),
      map((userName) => success({ userName }))
    );
  }
}
@CommandHandler(SetActiveUserCommand)
export class SetActiveUserHandler
  implements ICommandHandler<SetActiveUserCommand>
{
  constructor(
    private activeUserStore: ActiveUserStore,
    private eventEmitter: RequestContextEventsEmitter
  ) {}
  public async execute({
    body: { userName },
  }: SetActiveUserCommand): Promise<Result<undefined>> {
    const currentActiveUser = (await this.activeUserStore.getState()).userName;
    if (currentActiveUser === userName) {
      return success(undefined);
    }
    await this.activeUserStore.set({
      userName,
    });
    if (userName) {
      this.eventEmitter.sendEvent("activeUserSet", {
        userName: userName,
      });
    }
    return success(undefined);
  }
}
