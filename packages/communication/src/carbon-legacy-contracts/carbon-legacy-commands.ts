import {
  defineCarbonCommand,
  defineCommand,
  UseCaseScope,
} from "@dashlane/framework-contracts";
import { AnyFunctionalError } from "@dashlane/framework-types";
import { carbonCommandsSlots } from "../CarbonApi";
import { createCommandContractsFromConnector } from "./ts-event-bus-adapter";
import { CarbonCommandParam, CarbonLegacyLeelooCommandParam } from "./types";
export interface CarbonCommandError extends AnyFunctionalError {
  tag: "";
  error: unknown;
}
export interface CarbonCommandResult {
  id: "";
  carbonResult: unknown;
}
export class CarbonCommand extends defineCarbonCommand<
  CarbonCommandParam,
  CarbonCommandResult,
  CarbonCommandError
>({
  scope: UseCaseScope.Device,
}) {}
export class CarbonLegacyLeelooCommand extends defineCarbonCommand<
  CarbonLegacyLeelooCommandParam,
  CarbonCommandResult,
  CarbonCommandError
>({
  scope: UseCaseScope.Device,
}) {}
export class MitigationDeleteGrapheneUserDataCommand extends defineCommand<{
  login: string;
}>({
  scope: UseCaseScope.Device,
}) {}
export const commandsFromCarbonAPI =
  createCommandContractsFromConnector(carbonCommandsSlots);
export const commands = {
  ...commandsFromCarbonAPI,
  CarbonCommand,
  CarbonLegacyLeelooCommand,
  MitigationDeleteGrapheneUserDataCommand,
};
