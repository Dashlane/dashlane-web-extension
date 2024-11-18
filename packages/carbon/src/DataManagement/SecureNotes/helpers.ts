import { isNil } from "ramda";
import { Note } from "@dashlane/communication";
export class RequestError extends Error {
  code: string;
  constructor(message: string, code: string) {
    super(message);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = "RequestError";
    this.code = code;
  }
}
export const createdAt = (note: Note) =>
  isNil(note.CreationDatetime)
    ? isNil(note.CreationDate)
      ? 0
      : note.CreationDate
    : note.CreationDatetime;
export const updatedAt = (note: Note) =>
  isNil(note.UserModificationDatetime)
    ? isNil(note.UpdateDate)
      ? 0
      : note.UpdateDate
    : note.UserModificationDatetime;
