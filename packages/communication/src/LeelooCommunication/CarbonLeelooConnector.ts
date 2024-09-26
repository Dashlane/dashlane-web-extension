import { slot } from "ts-event-bus";
import { ABTestingEvent } from "../ABTesting";
import {
  CheckLoginResponse,
  ConfirmAccountCreationRequest,
  ConfirmAccountCreationResult,
  CreateAccountRequest,
  CreateAccountResult,
} from "../AccountCreation/Interfaces";
import * as Logging from "../Logging";
import * as OpenSessionEvents from "../OpenSession";
import {
  CurrentLocationUpdated,
  RemovePersonalDataItem,
  RemovePersonalDataItemResponse,
  SavePersonalDataItemResponse,
  TeamUpdatedRequest,
  TeamUpdatedResponse,
} from "./interfaces";
import { SpaceDataUpdatedEvent } from "../SpaceData";
import * as SubscriptionEvents from "../Subscription";
import {
  AcceptMasterPasswordResetDemandRequest,
  AcceptMasterPasswordResetDemandResult,
  DeclineMasterPasswordResetDemandRequest,
  DeclineMasterPasswordResetDemandResult,
  ListMasterPasswordResetDemandsRequest,
  ListMasterPasswordResetDemandsResponse,
} from "../MasterPasswordReset";
import {
  CheckIfMasterPasswordIsValidRequest,
  CheckIfMasterPasswordIsValidResponse,
} from "../MasterPassword";
import { WebOnboardingModeEvent } from "../Onboarding";
import {
  AddTeamAdminRequest,
  AddTeamAdminResult,
  CheckDirectorySyncKeyRequest,
  CheckDirectorySyncKeyResponse,
  CreateUserGroupRequest,
  CreateUserGroupResult,
  DeleteUserGroupRequest,
  DeleteUserGroupResult,
  GetTeamMembersRequest,
  GetTeamMembersResult,
  InviteUserGroupMembersRequest,
  InviteUserGroupMembersResult,
  LoginResultEnum,
  PersonalSettings,
  QueryStaticDataCollectionsRequest,
  QueryStaticDataCollectionsResponse,
  RemoveTeamAdminRequest,
  RemoveTeamAdminResult,
  RenameUserGroupRequest,
  RenameUserGroupResult,
  RevokeUserGroupMembersRequest,
  RevokeUserGroupMembersResult,
  SavePaymentCardEvent,
  SetTeamSettingsRequest,
  SetTeamSettingsResult,
  TeamAdminDataUpdatedEvent,
  UpdatePaymentCardTokenResult,
  UpdateUserGroupMembersRequest,
  UpdateUserGroupMembersResult,
} from "../";
import { SavePersonalDataItemFromUI } from "../Save";
export const CarbonLeelooConnector = {
  abTestingChanged: slot<ABTestingEvent>(),
  carbonLoginStatusChanged: slot<OpenSessionEvents.LoginStatusChanged>({
    noBuffer: true,
  }),
  openSessionProgressChanged:
    slot<OpenSessionEvents.OpenSessionProgressChanged>({ noBuffer: true }),
  openSessionTokenSent: slot<OpenSessionEvents.OpenSessionTokenSent>({
    noBuffer: true,
  }),
  openSessionDashlaneAuthenticator: slot<void>({ noBuffer: true }),
  openSessionOTPSent: slot<OpenSessionEvents.OpenSessionOTPSent>({
    noBuffer: true,
  }),
  openSessionOTPForNewDeviceRequired: slot<void>({ noBuffer: true }),
  openSessionAskMasterPassword:
    slot<OpenSessionEvents.OpenSessionAskMasterPassword>({
      noBuffer: true,
    }),
  openSessionTokenWarning: slot<OpenSessionEvents.OpenSessionTokenWarning>({
    noBuffer: true,
  }),
  openSessionExtraDeviceTokenRequired: slot<void>({ noBuffer: true }),
  openSessionSsoRedirectionToIdpRequired:
    slot<OpenSessionEvents.OpenSessionSsoRedirectionToIdpRequired>({
      noBuffer: true,
    }),
  openSessionMasterPasswordLess: slot<void>({ noBuffer: true }),
  openSessionFailed: slot<OpenSessionEvents.OpenSessionFailed>({
    noBuffer: true,
  }),
  sessionSyncStatus: slot<OpenSessionEvents.SessionSyncStatus>({
    noBuffer: true,
  }),
  localAccountsListUpdated: slot<OpenSessionEvents.LocalAccountsListUpdated>(),
  spaceDataUpdated: slot<SpaceDataUpdatedEvent>(),
  teamAdminDataUpdated: slot<TeamAdminDataUpdatedEvent>(),
  accountFeaturesChanged: slot<OpenSessionEvents.AccountFeatures>(),
  updatePaymentCardTokenResult: slot<UpdatePaymentCardTokenResult>(),
  webOnboardingModeUpdated: slot<WebOnboardingModeEvent>(),
  currentLocationUpdated: slot<CurrentLocationUpdated>(),
  checkDirectorySyncKeyRequest: slot<CheckDirectorySyncKeyRequest>(),
  serverSidePairingStatusChanged:
    slot<OpenSessionEvents.ServerSidePairingStatusChanged>(),
  getUki: slot<null, OpenSessionEvents.GetUki>(),
  getAccountInfo: slot<null, OpenSessionEvents.AccountInfo>(),
  getDevicesList: slot<null, OpenSessionEvents.GetDevicesList>(),
  getLocalAccountsList: slot<null, OpenSessionEvents.GetLocalAccountsList>(),
  getInvoices: slot<null, OpenSessionEvents.GetInvoices>(),
  getPersonalSettings: slot<null, PersonalSettings>(),
  openSession: slot<OpenSessionEvents.OpenSession, LoginResultEnum>({
    noBuffer: true,
  }),
  openSessionWithToken: slot<OpenSessionEvents.OpenSessionWithToken>({
    noBuffer: true,
  }),
  openSessionWithDashlaneAuthenticator:
    slot<OpenSessionEvents.OpenSessionWithDashlaneAuthenticator>({
      noBuffer: true,
    }),
  cancelDashlaneAuthenticatorRegistration: slot<void>(),
  openSessionWithOTP: slot<OpenSessionEvents.OpenSessionWithOTP>({
    noBuffer: true,
  }),
  openSessionWithOTPForNewDevice:
    slot<OpenSessionEvents.OpenSessionWithOTPForNewDevice>({
      noBuffer: true,
    }),
  openSessionResendToken: slot<OpenSessionEvents.OpenSessionResendToken>({
    noBuffer: true,
  }),
  sessionForceSync: slot<OpenSessionEvents.SessionForceSync>(),
  closeSession: slot<OpenSessionEvents.CloseSession, void>(),
  lockSession: slot<OpenSessionEvents.LockSession>({ noBuffer: true }),
  cancelPremiumSubscription: slot<
    null,
    SubscriptionEvents.CancelPremiumSubscription
  >(),
  createUserGroup: slot<CreateUserGroupRequest, CreateUserGroupResult>(),
  deleteUserGroup: slot<DeleteUserGroupRequest, DeleteUserGroupResult>(),
  renameUserGroup: slot<RenameUserGroupRequest, RenameUserGroupResult>(),
  inviteUserGroupMembers: slot<
    InviteUserGroupMembersRequest,
    InviteUserGroupMembersResult
  >(),
  revokeUserGroupMembers: slot<
    RevokeUserGroupMembersRequest,
    RevokeUserGroupMembersResult
  >(),
  updateUserGroupMembers: slot<
    UpdateUserGroupMembersRequest,
    UpdateUserGroupMembersResult
  >(),
  teamUpdated: slot<TeamUpdatedRequest, TeamUpdatedResponse>(),
  createAccountStep1: slot<CreateAccountRequest, CreateAccountResult>(),
  createAccountStep2: slot<
    ConfirmAccountCreationRequest,
    ConfirmAccountCreationResult
  >(),
  checkLogin: slot<string, CheckLoginResponse>(),
  savePersonalDataItem: slot<
    SavePersonalDataItemFromUI,
    SavePersonalDataItemResponse
  >(),
  removePersonalDataItem: slot<
    RemovePersonalDataItem,
    RemovePersonalDataItemResponse
  >(),
  savePaymentCard: slot<SavePaymentCardEvent>(),
  getMasterPasswordResetDemandList: slot<
    ListMasterPasswordResetDemandsRequest,
    ListMasterPasswordResetDemandsResponse
  >(),
  acceptMasterPasswordResetDemand: slot<
    AcceptMasterPasswordResetDemandRequest,
    AcceptMasterPasswordResetDemandResult
  >(),
  checkIfMasterPasswordIsValid: slot<
    CheckIfMasterPasswordIsValidRequest,
    CheckIfMasterPasswordIsValidResponse
  >(),
  declineMasterPasswordResetDemand: slot<
    DeclineMasterPasswordResetDemandRequest,
    DeclineMasterPasswordResetDemandResult
  >(),
  getMembers: slot<GetTeamMembersRequest, GetTeamMembersResult>(),
  addTeamAdmin: slot<AddTeamAdminRequest, AddTeamAdminResult>(),
  removeTeamAdmin: slot<RemoveTeamAdminRequest, RemoveTeamAdminResult>(),
  setTeamSettings: slot<SetTeamSettingsRequest, SetTeamSettingsResult>(),
  updateWebOnboardingMode: slot<WebOnboardingModeEvent>(),
  checkDirectorySyncKeyResponse: slot<CheckDirectorySyncKeyResponse>(),
  queryStaticDataCollections: slot<
    QueryStaticDataCollectionsRequest,
    QueryStaticDataCollectionsResponse
  >(),
  resumeSession: slot<OpenSessionEvents.ResumeSession, boolean>(),
  exceptionLog: slot<Logging.ExceptionLog>(),
};
