export interface PersistMassDeploymentTeamKeyRequest {
  massDeploymentTeamAccessKey: string;
  massDeploymentTeamSecretKey: string;
}
export type PersistMassDeploymentTeamKeySuccess = {
  success: true;
};
export type PersistMassDeploymentTeamKeyFailure = {
  success: false;
  error: string;
};
export type PersistMassDeploymentTeamKeyResult =
  | PersistMassDeploymentTeamKeySuccess
  | PersistMassDeploymentTeamKeyFailure;
export type GetMassDeploymentTeamKeySuccess = {
  success: true;
  massDeploymentTeamAccessKey: string;
  massDeploymentTeamSecretKey: string;
};
export type GetMassDeploymentTeamKeyFailure = {
  success: false;
  error: string;
};
export type GetMassDeploymentTeamKeyResult =
  | GetMassDeploymentTeamKeySuccess
  | GetMassDeploymentTeamKeyFailure;
