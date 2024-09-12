import {
  FileUploadedEvent,
  FileUploadedEventData,
} from "@dashlane/framework-contracts";
import { IEventHandler } from "../cqrs";
export abstract class FileUploadedEventHandler<UploadKey extends string>
  implements IEventHandler<FileUploadedEvent>
{
  protected constructor(protected uploadKey: UploadKey) {}
  handle({ body }: FileUploadedEvent): Promise<void> {
    if (body.uploadKey === this.uploadKey) {
      return Promise.resolve(this.handleUploadedFile(body.fileUploadData));
    }
    return Promise.resolve(undefined);
  }
  abstract handleUploadedFile(
    fileUploadData: FileUploadedEventData
  ): void | Promise<void>;
}
