import {
  ab2str,
  base64ToBuffer,
  bufferToBase64,
} from "Libs/CryptoCenter/Helpers/Helper";
export class DownloadedFile {
  private readonly _buf: ArrayBuffer;
  public name: string;
  constructor(name: string, buf: ArrayBuffer) {
    this._buf = buf;
    this.name = name;
  }
  static fromBase64Str(fileName: string, base64Str: string): DownloadedFile {
    return new DownloadedFile(fileName, base64ToBuffer(base64Str));
  }
  toBlob(): Blob {
    return new Blob([this._buf]);
  }
  toString(): string {
    return ab2str(this._buf);
  }
  toBase64String(): string {
    return bufferToBase64(this._buf);
  }
}
