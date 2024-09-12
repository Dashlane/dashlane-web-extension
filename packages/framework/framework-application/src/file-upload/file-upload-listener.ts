import { Injectable } from "@nestjs/common";
import { FileUploadedEventsEmitter } from "./file-upload-events-emitter";
@Injectable()
export abstract class FileUploadListener {
  constructor(protected eventEmitter: FileUploadedEventsEmitter) {}
  public abstract listen(): void;
}
