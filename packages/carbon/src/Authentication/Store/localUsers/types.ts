export interface LocalUserAuthenticationState {
  deviceAccessKey: string;
  deviceRegisteredWithLegacyKey: boolean;
  ssoActivatedUser: boolean;
}
export interface LocalUsersAuthenticationState {
  [login: string]: LocalUserAuthenticationState;
}
