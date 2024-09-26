import { Command } from "Shared/Api";
import {
  GetFamilyDetailsResult,
  JoinFamilyRequest,
  JoinFamilyResult,
  LeaveFamilyResult,
  RemoveFamilyMemberRequest,
  RemoveFamilyMemberResult,
  ResetFamilyJoinTokenResult,
} from "@dashlane/communication";
export type FamilyCommands = {
  getFamilyDetails: Command<void, GetFamilyDetailsResult>;
  joinFamily: Command<JoinFamilyRequest, JoinFamilyResult>;
  leaveFamily: Command<void, LeaveFamilyResult>;
  removeFamilyMember: Command<
    RemoveFamilyMemberRequest,
    RemoveFamilyMemberResult
  >;
  resetFamilyJoinToken: Command<void, ResetFamilyJoinTokenResult>;
};
