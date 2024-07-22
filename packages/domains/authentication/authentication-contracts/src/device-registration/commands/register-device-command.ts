import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import { Matchable } from "@dashlane/framework-types";
import { z } from "zod";
export const registrationSchema = z.discriminatedUnion("with", [
  z.object({
    with: z.literal("token"),
    login: z.string(),
    token: z.string(),
    deviceName: z.optional(z.string()),
    ignoreAlreadyRegisteredError: z.optional(z.boolean()),
  }),
  z.object({
    with: z.literal("authTicket"),
    login: z.string(),
    authTicket: z.string(),
    deviceName: z.optional(z.string()),
    ignoreAlreadyRegisteredError: z.optional(z.boolean()),
  }),
  z.object({
    with: z.literal("deviceKeys"),
    login: z.string(),
    deviceName: z.optional(z.string()),
    ignoreAlreadyRegisteredError: z.optional(z.boolean()),
    deviceAccessKey: z.string(),
    deviceSecretKey: z.string(),
    settings: z.string(),
    userAnalyticsId: z.string(),
    serverKey: z.optional(z.string()),
  }),
]);
export type RegisterDeviceCommandParam = z.infer<typeof registrationSchema>;
export type OneDeviceIsAlreadyRegisteredForThisAccountError =
  Matchable<"DeviceAlreadyRegistered">;
export type InvalidTokenError = Matchable<"InvalidTokenError">;
export type RegisterDeviceNetworkError = Matchable<"NetworkError">;
export type RegisterDeviceCommandErrors =
  | OneDeviceIsAlreadyRegisteredForThisAccountError
  | InvalidTokenError
  | RegisterDeviceNetworkError;
export class RegisterDeviceCommand extends defineCommand<
  RegisterDeviceCommandParam,
  undefined,
  RegisterDeviceCommandErrors
>({
  scope: UseCaseScope.Device,
}) {}
