import { StartTaskTrackingCommand } from "@dashlane/framework-contracts";
import { success } from "@dashlane/framework-types";
import { CommandHandler } from "../../../cqrs/commands.decorators";
import {
  CommandHandlerResponseOf,
  ICommandHandler,
} from "../../../cqrs/commands.types";
import { TaskTrackingStore } from "./task-tracking.store";
@CommandHandler(StartTaskTrackingCommand)
export class StartTaskTrackingCommandHandler
  implements ICommandHandler<StartTaskTrackingCommand>
{
  constructor(private store: TaskTrackingStore) {}
  async execute({
    body,
  }: StartTaskTrackingCommand): CommandHandlerResponseOf<StartTaskTrackingCommand> {
    const startTime = new Date().toISOString();
    const { taskName, feature, businessDomain } = body;
    const taskTrackingEntry = {
      taskName,
      feature,
      businessDomain,
      startTime,
      serviceWorkerInterruptionCount: 0,
    };
    const currentState = await this.store.getState();
    await this.store.set({
      ...currentState,
      taskTrackingList: {
        ...currentState.taskTrackingList,
        [startTime]: taskTrackingEntry,
      },
    });
    return Promise.resolve(
      success({
        id: startTime,
      })
    );
  }
}
