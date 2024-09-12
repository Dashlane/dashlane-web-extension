import { Codec } from "@dashlane/framework-services";
import { Injectable } from "@nestjs/common";
@Injectable()
export abstract class DefaultEncryptionCodecForDeviceData
  implements Codec<ArrayBuffer, ArrayBuffer>
{
  abstract decode(toDecode: ArrayBuffer): Promise<ArrayBuffer> | ArrayBuffer;
  abstract encode(toEncode: ArrayBuffer): Promise<ArrayBuffer> | ArrayBuffer;
}
@Injectable()
export abstract class DefaultEncryptionCodecForUserData
  implements Codec<ArrayBuffer, ArrayBuffer>
{
  abstract decode(toDecode: ArrayBuffer): Promise<ArrayBuffer> | ArrayBuffer;
  abstract encode(toEncode: ArrayBuffer): Promise<ArrayBuffer> | ArrayBuffer;
}
