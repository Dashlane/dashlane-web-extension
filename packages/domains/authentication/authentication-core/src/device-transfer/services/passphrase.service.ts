import {
  Injectable,
  JsonApplicationResourceFetcher,
  JsonApplicationResourceLoader,
} from "@dashlane/framework-application";
import { base64ToUInt8Array } from "../utils/utils";
export const PASSPHRASE_SIZE_BYTES = 4;
export const PASSPHRASE_WORD_COUNT = 5;
export const PASSPHRASE_SEPARATOR = " ";
export const PASSPHRASE_MAX_RANDOMINT = Math.pow(2, 32) - 1;
@Injectable()
export class WordlistFetcher extends JsonApplicationResourceLoader<string[]> {
  constructor(fetcher: JsonApplicationResourceFetcher) {
    super("assets/eff_large_wordlist.json", fetcher);
  }
  loadResource(jsonObject: unknown): string[] {
    if (!jsonObject || !Array.isArray(jsonObject)) {
      throw new Error("Failed to load word list");
    }
    return jsonObject;
  }
}
@Injectable()
export class PassphraseService {
  constructor(private fetcher: WordlistFetcher) {}
  public getWordList() {
    return this.fetcher.get();
  }
  public async generatePassphraseChallenge(wordSeed: string) {
    const wordList = await this.getWordList();
    const passphraseList = [];
    const maxRandom =
      Math.floor(PASSPHRASE_MAX_RANDOMINT / wordList.length) * wordList.length;
    for (let i = 0; i < wordSeed.length; i += PASSPHRASE_SIZE_BYTES) {
      const { buffer, byteOffset } = new Uint8Array(
        base64ToUInt8Array(wordSeed).slice(i, i + PASSPHRASE_SIZE_BYTES)
      );
      const current = new DataView(buffer).getUint32(byteOffset, true);
      if (current < maxRandom) {
        const word = wordList[current % wordList.length];
        passphraseList.push(word);
      }
      if (passphraseList.length === PASSPHRASE_WORD_COUNT) {
        break;
      }
    }
    return {
      passphrase: passphraseList.join(PASSPHRASE_SEPARATOR),
      missingWordIndex: Math.floor(Math.random() * PASSPHRASE_WORD_COUNT),
    };
  }
  public verifyChallenge(passphrase: string, passphraseGuess: string) {
    if (!passphrase) {
      throw new Error(
        "[DEVICE-TRANSFER]: Passphrase challenge not generated yet"
      );
    }
    if (!passphraseGuess) {
      throw new Error(
        "[DEVICE-TRANSFER]: Passphrase guess not saved to machine context"
      );
    }
    return passphrase === passphraseGuess;
  }
}
