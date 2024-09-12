import { FrameworkInit, OnFrameworkInit } from "../dependency-injection";
import { FileUploadListener } from "./file-upload-listener";
@FrameworkInit()
export class FileUploadBootstrap implements OnFrameworkInit {
  constructor(private fileUploadListener: FileUploadListener) {}
  public onFrameworkInit() {
    try {
      this.fileUploadListener.listen();
    } catch (err) {
      console.error("error while initializing file-upload listener", err);
    }
  }
}
