import { arrayBufferToText, base64ToArrayBuffer, hexToBuffer, } from '@dashlane/framework-encoding';
import { decryptAes256, decryptAesEcb256, deriveKeyPbkdf2, } from '@dashlane/framework-infra';
const LAST_PASS_HEADERS = 'url,username,password,otp,extra,name,grouping,fav';
const GROUP_IDENTIFIER_URL = '*****';
const decryptField = async (fieldString: string, key: ArrayBuffer) => {
    if (!fieldString) {
        return '';
    }
    if (fieldString.startsWith('!')) {
        const [encodedIvWithIdentifier, encodedEncryptedData] = fieldString.split('|');
        const encodedIv = encodedIvWithIdentifier.slice(1);
        const iv = base64ToArrayBuffer(encodedIv).slice(0, 16);
        const encryptedData = base64ToArrayBuffer(encodedEncryptedData);
        const decryptedData = await decryptAes256(key, iv, encryptedData);
        return arrayBufferToText(decryptedData);
    }
    else {
        const textEncoder = new TextEncoder();
        const encryptedData = textEncoder.encode(fieldString);
        const decryptedData = arrayBufferToText(decryptAesEcb256(key, encryptedData));
        return decryptedData;
    }
};
export const parseLastPassItemsIntoCsv = async (userLogin: string, userPassword: string, iterations: number, vaultXML: Document) => {
    const csvRows = [LAST_PASS_HEADERS];
    const textEncoder = new TextEncoder();
    const textDecoder = new TextDecoder();
    const key = await deriveKeyPbkdf2(textEncoder.encode(userPassword), textEncoder.encode(userLogin.toLocaleLowerCase()), {
        iterations: iterations,
        hashType: 'SHA-256',
    });
    const nodes = vaultXML.documentElement.querySelectorAll('*');
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].tagName === 'account') {
            const loginNode = nodes[i].getElementsByTagName('login')?.[0];
            const encryptedName = nodes[i].getAttribute('name') ?? '';
            const encryptedCollection = nodes[i].getAttribute('group') ?? '';
            const encryptedNotes = nodes[i].getAttribute('extra') ?? '';
            const fav = nodes[i].getAttribute('fav') ?? '0';
            const hexUrl = loginNode?.getAttribute('url') ?? '';
            const encryptedPassword = loginNode?.getAttribute('p') ?? '';
            const encryptedUsername = loginNode?.getAttribute('u') ?? '';
            const encryptedOtp = loginNode?.getAttribute('o') ?? '';
            const name = await decryptField(encryptedName, key);
            const collection = await decryptField(encryptedCollection, key);
            const notes = await decryptField(encryptedNotes, key);
            const url = textDecoder.decode(hexToBuffer(hexUrl));
            const password = await decryptField(encryptedPassword, key);
            const username = await decryptField(encryptedUsername, key);
            const otp = await decryptField(encryptedOtp, key);
            if (url === GROUP_IDENTIFIER_URL) {
                continue;
            }
            csvRows.push(`"${url}","${username}","${password}","${otp}","${notes}","${name}","${collection}","${fav}"`);
        }
    }
    const csvContent = csvRows.join('\n');
    const fileBlob = new Blob([csvContent], { type: 'text/csv' });
    const csvFile = new File([fileBlob], 'lastpass.csv', { type: 'text/csv' });
    return csvFile;
};
