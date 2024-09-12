import { success } from "@dashlane/framework-types";
import { ReportAnomalyCommand } from "@dashlane/framework-contracts";
import { CommandHandler } from "../../../cqrs/commands.decorators";
import {
  CommandHandlerResponseOf,
  ICommandHandler,
} from "../../../cqrs/commands.types";
import { AnomalyReporter } from "../anomaly-reporter";
@CommandHandler(ReportAnomalyCommand)
export class ReportAnomalyCommandHandler
  implements ICommandHandler<ReportAnomalyCommand>
{
  constructor(private readonly reporter: AnomalyReporter) {}
  async execute({
    body,
  }: ReportAnomalyCommand): CommandHandlerResponseOf<ReportAnomalyCommand> {
    this.reporter.report({
      ...body,
      criticality: body.criticality,
      message: body.message,
      moduleNameOverride: body.moduleName,
      useCaseNameOverride: body.useCaseName,
      additionalInfo: "",
    });
    return Promise.resolve(success(undefined));
  }
}
