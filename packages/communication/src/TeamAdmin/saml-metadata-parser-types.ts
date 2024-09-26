export enum IDPXmlParseErrors {
  XML_PARSE_FAILED = "xml_parse_failed",
}
export enum IDPMetadataParseErrors {
  KEY_DESCRIPTOR_NOT_FOUND = "key_descriptor_not_found",
  IDP_ENTRYPOINT_NOT_FOUND = "idp_entrypoint_not_found",
  INVALID_IDP_SSO_DESCRIPTOR = "invalid_idp_sso_descriptor",
  MISSING_CERTIFICATE = "missing_certificate",
  MULTIPLE_CERTIFICATES = "multiple_certificates",
  CERTIFICATE_TOO_SHORT = "certificate_too_short",
  CERTIFICATE_TOO_LONG = "certificate_too_long ",
  CERTIFICATE_DECODE_FAILED = "certificate_decode_failed",
  INVALID_ENTRYPOINT = "invalid_entrypoint",
}
export interface ParseMetadataFieldsRequest {
  ssoIdpMetadata: string;
}
export interface ParsedMetadataFields {
  samlIdpCertificate: string;
  samlIdpEntryPoint: string;
}
interface ParseMetadataFieldsSuccess {
  success: true;
  data: ParsedMetadataFields;
}
interface ParseMetadataFieldsError {
  success: false;
  error: IDPMetadataParseErrors | IDPXmlParseErrors;
}
export type ParseMetadataFieldsResult =
  | ParseMetadataFieldsSuccess
  | ParseMetadataFieldsError;
