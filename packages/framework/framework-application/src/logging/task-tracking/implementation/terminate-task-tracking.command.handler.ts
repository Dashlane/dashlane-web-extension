import { CarbonLegacyClient } from "@dashlane/communication";
import { success } from "@dashlane/framework-types";
import { TerminateTaskTrackingCommand } from "@dashlane/framework-contracts";
import { UserMv3ExtensionTaskReportEvent } from "@dashlane/hermes";
import { CommandHandler } from "../../../cqrs/commands.decorators";
import {
  CommandHandlerResponseOf,
  ICommandHandler,
} from "../../../cqrs/commands.types";
import { TaskTrackingStore } from "./task-tracking.store";
import { AppLogger } from "../../../application/logger";
@CommandHandler(TerminateTaskTrackingCommand)
export class TerminateTaskTrackingCommandHandler
  implements ICommandHandler<TerminateTaskTrackingCommand>
{
  constructor(
    private store: TaskTrackingStore,
    private carbonLegacyClient: CarbonLegacyClient,
    private logger: AppLogger
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
    const {
      taskName,
      feature,
      businessDomain,
      startTime,
      serviceWorkerInterruptionCount,
    } = task;
    const event = new UserMv3ExtensionTaskReportEvent({
      businessDomain,
      feature,
      serviceWorkerInterruptionCount,
      serviceWorkerStartDateTime: state.swStartTime,
      taskName,
      taskStartDateTime: startTime,
      taskEndDateTime: new Date().toISOString(),
    });
    const carbonLegacy = this.carbonLegacyClient;
    await carbonLegacy.commands.carbon({ name: "logEvent", args: [{ event }] });
    const newTaskTrackingList = { ...state.taskTrackingList };
    delete newTaskTrackingList[taskTrackingId];
    await this.store.set({
      swStartTime: state.swStartTime,
      taskTrackingList: newTaskTrackingList,
    });
    return success(undefined);
  }
}
