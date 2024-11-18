import { v4 as uuidv4 } from "uuid";
export function generateItemUuid(): string {
  return `{${uuidv4().toUpperCase()}}`;
}
