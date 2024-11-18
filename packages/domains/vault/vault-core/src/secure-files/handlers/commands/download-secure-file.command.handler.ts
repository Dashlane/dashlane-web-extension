import {
  CommandHandler,
  FileDownloadService,
  HttpClient,
  type ICommandHandler,
} from "@dashlane/framework-application";
import {
  FlexibleDecryptor,
  regroupNetworkErrors,
  ServerApiClient,
} from "@dashlane/framework-dashlane-application";
import {
  failure,
  getSuccess,
  isSuccess,
  match,
  success,
} from "@dashlane/framework-types";
import {
  createNoRemoteFileError,
  DownloadSecureFileCommand,
  ProgressStatus,
} from "@dashlane/vault-contracts";
import { firstValueFrom } from "rxjs";
import { base64ToArrayBuffer } from "@dashlane/framework-encoding";
import { SecureFilesProgressStore } from "../../stores";
@CommandHandler(DownloadSecureFileCommand)
export class DownloadSecureFileCommandHandler
  implements ICommandHandler<DownloadSecureFileCommand>
{
  constructor(
    private serverApiClient: ServerApiClient,
    private flexibleDecryptor: FlexibleDecryptor,
    private fileDownloadService: FileDownloadService,
    private progressStore: SecureFilesProgressStore,
    private httpClient: HttpClient
  ) {}
  async execute({ body }: DownloadSecureFileCommand) {
    const { cryptoKey, downloadKey, filename, type } = body;
    await this.progressStore.set({
      [downloadKey]: ProgressStatus.Started,
    });
    const downloadLinkResult = await this.getDownloadLink(downloadKey);
    if (!isSuccess(downloadLinkResult)) {
      return downloadLinkResult;
    }
    const downloadLink = getSuccess(downloadLinkResult);
    await this.progressStore.set({
      [downloadKey]: ProgressStatus.Linked,
    });
    const downloadContent = await this.fetchDownloadLinkContent(downloadLink);
    if (!isSuccess(downloadContent)) {
      return downloadContent;
    }
    await this.progressStore.set({
      [downloadKey]: ProgressStatus.Fetched,
    });
    const cryptoKeyBuffer = base64ToArrayBuffer(cryptoKey);
    const decipheredContent = await this.decryptContent(
      cryptoKeyBuffer,
      getSuccess(downloadContent)
    );
    await this.progressStore.set({
      [downloadKey]: ProgressStatus.Ciphered,
    });
    await this.downloadFile(filename, type, decipheredContent);
    await this.progressStore.set({
      [downloadKey]: ProgressStatus.Completed,
    });
    return success(undefined);
  }
  private async getDownloadLink(downloadKey: string) {
    try {
      const serverResult = await firstValueFrom(
        this.serverApiClient.v1.securefile.getDownloadLink({
          key: downloadKey,
        })
      );
      if (!isSuccess(serverResult)) {
        return match(serverResult.error, {
          ...regroupNetworkErrors((err) => {
            throw new Error(
              "Unexpected server error while attempting to download remote secure file",
              { cause: err }
            );
          }),
          BusinessError: () => failure(createNoRemoteFileError()),
        });
      }
      return success(serverResult.data.data.url);
    } catch (error) {
      throw new Error("Unexpectedly unable to retrieve download link", {
        cause: error,
      });
    }
  }
  private async fetchDownloadLinkContent(downloadLink: string) {
    const contentArrayBuffer = await this.fetchContent(downloadLink);
    if (!isSuccess(contentArrayBuffer)) {
      return contentArrayBuffer;
    }
    try {
      return success(new Uint8Array(getSuccess(contentArrayBuffer)));
    } catch (error) {
      throw new Error("Unexpectedly unable to deserialize downloaded content", {
        cause: error,
      });
    }
  }
  private async fetchContent(downloadLink: string) {
    try {
      const requestResult = await firstValueFrom(
        this.httpClient.get(downloadLink, {
          observe: "body",
          responseType: "arraybuffer",
        })
      );
      if (!isSuccess(requestResult)) {
        return match(requestResult.error, {
          ...regroupNetworkErrors((err) => {
            throw new Error(
              "Unexpectedly unable to fetch download link content",
              { cause: err }
            );
          }),
          BadStatus: () => failure(createNoRemoteFileError()),
        });
      }
      return success(requestResult.data);
    } catch (error) {
      throw new Error("Unexpectedly unable to fetch download link content", {
        cause: error,
      });
    }
  }
  private async decryptContent(
    cryptoKeyBuffer: ArrayBuffer,
    content: Uint8Array
  ) {
    try {
      return await this.flexibleDecryptor.decrypt(cryptoKeyBuffer, content);
    } catch (error) {
      throw new Error("Unexpectedly unable to decrypt downloaded content", {
        cause: error,
      });
    }
  }
  private async downloadFile(
    filename: string,
    type: string,
    decipheredContent: ArrayBuffer
  ) {
    try {
      return await this.fileDownloadService.downloadFile(
        filename,
        type,
        decipheredContent
      );
    } catch (error) {
      throw new Error("Unexpectedly unable to download deciphered content", {
        cause: error,
      });
    }
  }
}
