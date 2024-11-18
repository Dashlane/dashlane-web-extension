import { Query } from "Shared/Api";
export type RemoteFileQueries = {
  getFileContent: Query<string, string>;
};
