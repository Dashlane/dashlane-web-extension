import { z } from "zod";
import { StatusSchema } from "../common-types";
export const SharingUserSchema = z.object({
  userId: z.string(),
  proposeSignature: z.optional(z.string()),
  acceptSignature: z.optional(z.nullable(z.string())),
  status: z.optional(StatusSchema),
  referrer: z.optional(z.string()),
  groupKey: z.optional(z.nullable(z.string())),
});
export type SharingUser = z.infer<typeof SharingUserSchema>;
export interface SharingUserGroup {
  groupId: string;
  name: string;
  revision: number;
  users: SharingUser[];
  publicKey: string;
  privateKey: string;
}
