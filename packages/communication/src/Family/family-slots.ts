import { slot } from "ts-event-bus";
import {
  GetFamilyDetailsResult,
  JoinFamilyRequest,
  JoinFamilyResult,
  LeaveFamilyResult,
  RemoveFamilyMemberRequest,
  RemoveFamilyMemberResult,
  ResetFamilyJoinTokenResult,
} from "./types";
export const familyCommandsSlots = {
  getFamilyDetails: slot<void, GetFamilyDetailsResult>(),
  joinFamily: slot<JoinFamilyRequest, JoinFamilyResult>(),
  leaveFamily: slot<void, LeaveFamilyResult>(),
  removeFamilyMember: slot<
    RemoveFamilyMemberRequest,
    RemoveFamilyMemberResult
  >(),
  resetFamilyJoinToken: slot<void, ResetFamilyJoinTokenResult>(),
};
