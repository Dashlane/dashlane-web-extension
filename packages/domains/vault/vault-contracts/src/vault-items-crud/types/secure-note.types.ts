import { z } from "zod";
import { BaseItem, EmbeddedAttachment } from "./common";
export enum NoteColors {
  BLUE = "BLUE",
  BROWN = "BROWN",
  GRAY = "GRAY",
  GREEN = "GREEN",
  ORANGE = "ORANGE",
  PINK = "PINK",
  PURPLE = "PURPLE",
  RED = "RED",
  YELLOW = "YELLOW",
}
export interface SecureNote extends BaseItem {
  categoryId: string;
  color: NoteColors;
  content: string;
  isSecured: boolean;
  title: string;
  attachments?: EmbeddedAttachment[];
}
export const SecureNoteSchema = z.object({
  color: z.string(),
  isSecured: z.boolean(),
  title: z.string(),
  content: z.string(),
  categoryId: z.string(),
});
