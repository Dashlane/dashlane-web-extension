import { defineCommand, UseCaseScope } from "@dashlane/framework-contracts";
import { NoRemoteFileError } from "./delete-secure-file.command";
export interface DownloadSecureFileCommandParam {
  type: string;
  filename: string;
  downloadKey: string;
  cryptoKey: string;
}
export class DownloadSecureFileCommand extends defineCommand<
  DownloadSecureFileCommandParam,
  undefined,
  NoRemoteFileError
>({
  scope: UseCaseScope.User,
}) {}
