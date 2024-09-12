import { CommandMessage } from "@dashlane/framework-contracts";
import { AnyFunctionalError, Result } from "@dashlane/framework-types";
export type CommandHandlerResponseOf<TCommand> =
  TCommand extends CommandMessage<unknown, infer TSuccess, infer TFailure>
    ? Promise<Result<TSuccess, TFailure>>
    : unknown;
export interface CommandInfo {
  readonly name: string;
}
export interface ICommandHandler<
  TCommand extends CommandMessage<unknown, unknown, AnyFunctionalError>
> {
  execute: (
    command: TCommand,
    commandInfo: CommandInfo
  ) => CommandHandlerResponseOf<TCommand>;
}
