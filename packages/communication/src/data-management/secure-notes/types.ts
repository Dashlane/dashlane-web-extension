import { EmbeddedAttachment, NoteType } from "../../DataModel";
import {
  DataModelDetailView,
  DataModelItemView,
  DataQuery,
  FilterCriterium,
  FilterToken,
  SortCriterium,
  SortToken,
} from "../types";
export type NoteSortField =
  | "id"
  | "title"
  | "updatedAt"
  | "createdAt"
  | "lastUse";
export type NoteFilterField = "id" | "spaceId" | "isLimited" | "hasAttachments";
export type NoteDataQuery = DataQuery<NoteSortField, NoteFilterField>;
export type NoteFilterToken = FilterToken<NoteFilterField>;
export type NoteSortToken = SortToken<NoteSortField>;
export interface SecureNoteSaveRequest {
  content: string;
  secured: boolean;
  title: string;
  type: NoteType;
  spaceId: string;
  attachments?: EmbeddedAttachment[];
}
export type AddSecureNoteRequest = SecureNoteSaveRequest;
export enum SecureNoteSaveResultErrorCode {
  NOT_FOUND = "NOT_FOUND",
}
export interface SecureNoteSaveResultSuccess {
  success: true;
}
export interface SecureNoteSaveResultError {
  success: false;
  error?: {
    code: SecureNoteSaveResultErrorCode;
  };
}
export enum DeleteSecureNoteErrorCode {
  NOT_FOUND = "NOT_FOUND",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  LEAVE_SHARING_FAILED = "LEAVE_SHARING_FAILED",
  LEAVE_SHARING_FORBIDDEN_LAST_ADMIN = "LEAVE_SHARING_FORBIDDEN_LAST_ADMIN",
  LEAVE_SHARING_FORBIDDEN_GROUP_ITEM = "LEAVE_SHARING_FORBIDDEN_GROUP_ITEM",
}
export type DeleteSecureNoteRequest = {
  id: string;
};
export type DeleteSecureNoteResultSuccess = {
  success: true;
};
export type DeleteSecureNoteResultError = {
  success: false;
  error: {
    code: DeleteSecureNoteErrorCode;
  };
};
export type DeleteSecureNoteResult =
  | DeleteSecureNoteResultSuccess
  | DeleteSecureNoteResultError;
export interface NoteItemView extends DataModelItemView {
  abbrContent: string;
  color: NoteType;
  createdAt: number;
  secured: boolean;
  title: string;
  updatedAt: number;
}
export interface NoteDetailView extends DataModelDetailView {
  color: NoteType;
  createdAt: number;
  content: string;
  secured: boolean;
  title: string;
  updatedAt: number;
}
export type NoteFilterCriterium = FilterCriterium<NoteFilterField>;
export type NoteSortCriterium = SortCriterium<NoteSortField>;
export interface NotesFirstTokenParams {
  sortCriteria: NoteSortCriterium[];
  filterCriteria?: NoteFilterCriterium[];
  initialBatchSize?: number;
}
