import { z } from "zod";
import { BaseItem } from "./common";
export interface Credential extends BaseItem {
  alternativeUsername: string;
  email: string;
  itemName: string;
  password: string;
  username: string;
  URL: string;
  linkedURLs: string[];
  note?: string;
  otpURL?: string;
  otpSecret?: string;
}
export const CredentialSchema = z.object({
  alternativeUsername: z.string(),
  email: z.string(),
  itemName: z.string(),
  password: z.string(),
  username: z.string(),
  URL: z.string(),
  linkedURLs: z.array(z.string()),
});
