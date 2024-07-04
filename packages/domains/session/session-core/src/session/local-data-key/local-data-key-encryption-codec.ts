import { DefaultEncryptionCodecForUserData, Injectable, } from '@dashlane/framework-application';
import { LocalDataKeyDecryptor } from './local-data-key-decryptor';
import { LocalDataKeyEncryptor } from './local-data-key-encryptor';
@Injectable()
export class LocalDataKeyEncryptionCodec implements DefaultEncryptionCodecForUserData {
    public constructor(private localDataKeyDecryptor: LocalDataKeyDecryptor, private localDatKeyaEncryptor: LocalDataKeyEncryptor) { }
    public encode(item: ArrayBuffer): Promise<ArrayBuffer> {
        return this.localDatKeyaEncryptor.encrypt(item);
    }
    public decode(item: ArrayBuffer): Promise<ArrayBuffer> {
        return this.localDataKeyDecryptor.decrypt(item);
    }
}
