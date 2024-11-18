import { success } from "@dashlane/framework-types";
import { TerminateTaskTrackingCommand } from "@dashlane/framework-contracts";
import { CommandHandler } from "../cqrs/commands.decorators";
import {
  CommandHandlerResponseOf,
  ICommandHandler,
} from "../cqrs/commands.types";
import { TaskTrackingStore } from "./task-tracking.store";
import { TaskTrackingModuleLogger } from "./task-tracking-logger";
@CommandHandler(TerminateTaskTrackingCommand)
export class TerminateTaskTrackingCommandHandler
  implements ICommandHandler<TerminateTaskTrackingCommand>
{
  constructor(
    private store: TaskTrackingStore,
    private logger: TaskTrackingModuleLogger
  ) {}
  async execute({
    body,
  }: TerminateTaskTrackingCommand): CommandHandlerResponseOf<TerminateTaskTrackingCommand> {
    const { taskTrackingId } = body;
    const state = await this.store.getState();
    const task = state.taskTrackingList[taskTrackingId];
    if (!task) {
      this.logger.trace("Trying to track a task that does not exist");
      return success(undefined);
    }
    const newTaskTrackingList = { ...state.taskTrackingList };
    delete newTaskTrackingList[taskTrackingId];
    await this.store.set({
      swStartTime: state.swStartTime,
      taskTrackingList: newTaskTrackingList,
    });
    return success(undefined);
  }
}
