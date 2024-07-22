import {
  arrayBufferToText,
  compress,
  decompress,
  textToArrayBuffer,
  utf8ChunkDecode,
  utf8ChunkEncode,
} from "@dashlane/framework-encoding";
export const compressDashlaneXml = (xml: string) => {
  const xmlUtf8 = utf8ChunkEncode(xml);
  const xmlArrayBuffer = textToArrayBuffer(xmlUtf8);
  const compressedXmlArrayBuffer = compress(xmlArrayBuffer);
  return compressedXmlArrayBuffer;
};
export const decompressDashlaneXml = (xmlCompressed: ArrayBuffer) => {
  const decpressedXmlBuffer = decompress(xmlCompressed);
  const decompressedXml = arrayBufferToText(decpressedXmlBuffer);
  return utf8ChunkDecode(decompressedXml);
};
