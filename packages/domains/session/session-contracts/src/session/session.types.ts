import { z } from "zod";
export const SessionKeySchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("mp"),
    masterPassword: z.string(),
    secondaryKey: z.optional(z.string()),
  }),
  z.object({ type: z.literal("sso"), ssoKey: z.string() }),
  z.object({ type: z.literal("exported"), content: z.string() }),
]);
export const DeviceKeysSchema = z.object({
  accessKey: z.string(),
  secretKey: z.string(),
});
export const PersonalSettingsSchema = z.object({
  CryptoUserPayload: z.string(),
  CryptoFixedSalt: z.string(),
});
const UserPersonalSettingsTransactionSchema = z.object({
  action: z.literal("BACKUP_EDIT"),
  backupDate: z.number(),
  content: z.string(),
  identifier: z.string(),
  time: z.number(),
  type: z.string(),
});
export const SessionCreationParamsSchema = z.object({
  email: z.string(),
  sessionKey: SessionKeySchema,
  deviceKeys: DeviceKeysSchema,
  personalSettings: PersonalSettingsSchema,
});
export const OpenSessionParamSchema = z.object({
  email: z.string(),
  sessionKey: SessionKeySchema,
  rememberPassword: z.boolean(),
});
export const CloseSessionParamsSchema = z.object({
  email: z.string(),
});
export const DeleteSessionParamsSchema = z.object({
  email: z.string(),
});
export const CheckSessionKeyParamsSchema = z.object({
  email: z.string(),
  sessionKey: SessionKeySchema,
});
export const UpdateSessionKeyParamsSchema = z.object({
  email: z.string(),
  sessionKey: SessionKeySchema,
});
export const CopyUserDataAndOpenSessionParamsSchema = z.object({
  currentEmail: z.string(),
  newEmail: z.string(),
  personalSettings: UserPersonalSettingsTransactionSchema,
});
export type SessionKey = z.infer<typeof SessionKeySchema>;
export type SessionCreationParams = z.infer<typeof SessionCreationParamsSchema>;
export type OpenSessionParam = z.infer<typeof OpenSessionParamSchema>;
export type CloseSessionParams = z.infer<typeof CloseSessionParamsSchema>;
export type DeleteSessionParams = z.infer<typeof DeleteSessionParamsSchema>;
export type CheckSessionKeyParams = z.infer<typeof CheckSessionKeyParamsSchema>;
export type UpdateSessionKeyParams = z.infer<
  typeof UpdateSessionKeyParamsSchema
>;
export type CopyUserDataAndOpenSessionParams = z.infer<
  typeof CopyUserDataAndOpenSessionParamsSchema
>;
