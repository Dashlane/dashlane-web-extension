type LocalAccount = {
  login: string;
};
export interface LocalAccountsQueryResult {
  readonly localAccounts: LocalAccount[];
}
