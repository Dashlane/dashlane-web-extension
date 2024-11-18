import {
  IDPMetadataParseErrors,
  IDPXmlParseErrors,
  ParsedMetadataFields,
  ParseMetadataFieldsRequest,
  ParseMetadataFieldsResult,
} from "@dashlane/communication";
import { isKWXMLElement, KWXMLElement, parseXml } from "@dashlane/kw-xml";
import { findAllKWXMLElementsOfType, removeNamespace } from "Libs/XML";
import { CoreServices } from "../../../Services";
export enum SamlTags {
  IDP_SSO_DESCRIPTOR = "IDPSSODescriptor",
  KEY_DESCRIPTOR = "KeyDescriptor",
  SINGLE_SIGN_ON_SERVICE = "SingleSignOnService",
  CERTIFICATE = "X509Certificate",
}
const CERT_MIN_LENGTH = 64;
const CERT_MAX_LENGTH = 4096;
function parseMetaData(metadata: string): Promise<KWXMLElement> {
  return new Promise((resolve, reject) => {
    parseXml((err, data) => {
      if (err) {
        reject(new Error(IDPXmlParseErrors.XML_PARSE_FAILED));
        return;
      }
      if (!isKWXMLElement(data)) {
        reject(new Error(IDPXmlParseErrors.XML_PARSE_FAILED));
        return;
      }
      resolve(data);
    }, metadata);
  });
}
function getIDPSSODescriptor(data: KWXMLElement) {
  const idpSSONodes = findAllKWXMLElementsOfType(
    data,
    SamlTags.IDP_SSO_DESCRIPTOR,
    []
  );
  if (idpSSONodes.length !== 1) {
    throw new Error(IDPMetadataParseErrors.INVALID_IDP_SSO_DESCRIPTOR);
  }
  return idpSSONodes[0];
}
function getIDPCertificate(data: KWXMLElement): string {
  const keyDescriptorNodes = findAllKWXMLElementsOfType(
    getIDPSSODescriptor(data),
    SamlTags.KEY_DESCRIPTOR,
    []
  );
  const keyDescriptorNodesSigning = keyDescriptorNodes.filter(
    (keyDescriptorNode) =>
      !keyDescriptorNode.__attributes__?.["use"] ||
      keyDescriptorNode.__attributes__?.["use"] === "signing"
  );
  if (!keyDescriptorNodesSigning.length) {
    throw new Error(IDPMetadataParseErrors.KEY_DESCRIPTOR_NOT_FOUND);
  }
  const certificateNodes: KWXMLElement[] = [];
  keyDescriptorNodesSigning.forEach((keyDescriptorNodeSigning) =>
    findAllKWXMLElementsOfType(
      keyDescriptorNodeSigning,
      SamlTags.CERTIFICATE,
      certificateNodes
    )
  );
  if (!certificateNodes.length) {
    throw new Error(IDPMetadataParseErrors.MISSING_CERTIFICATE);
  }
  if (certificateNodes.length > 1) {
    throw new Error(IDPMetadataParseErrors.MULTIPLE_CERTIFICATES);
  }
  const certValue = certificateNodes[0].__value__;
  if (!certValue?.length) {
    throw new Error(IDPMetadataParseErrors.MISSING_CERTIFICATE);
  }
  if (certValue.length < CERT_MIN_LENGTH) {
    throw new Error(IDPMetadataParseErrors.CERTIFICATE_TOO_SHORT);
  }
  if (certValue.length > CERT_MAX_LENGTH) {
    throw new Error(IDPMetadataParseErrors.CERTIFICATE_TOO_LONG);
  }
  try {
    atob(certValue);
  } catch {
    throw new Error(IDPMetadataParseErrors.CERTIFICATE_DECODE_FAILED);
  }
  return certValue;
}
function getIDPEntrypoint(data: KWXMLElement): string {
  const singleSignOnHTTPPost = getIDPSSODescriptor(data)
    .__children__.filter((node) => {
      if (isKWXMLElement(node)) {
        return (
          removeNamespace(node.__type__) === SamlTags.SINGLE_SIGN_ON_SERVICE
        );
      }
    })
    .find((node) => {
      if (isKWXMLElement(node)) {
        const binding = node.__attributes__["Binding"];
        if (typeof binding === "string") {
          return binding.includes("HTTP-POST");
        }
      }
    });
  if (!singleSignOnHTTPPost) {
    throw new Error(IDPMetadataParseErrors.IDP_ENTRYPOINT_NOT_FOUND);
  }
  if (isKWXMLElement(singleSignOnHTTPPost)) {
    const location = singleSignOnHTTPPost.__attributes__["Location"];
    if (typeof location === "string") {
      return location;
    } else {
      throw new Error(IDPMetadataParseErrors.INVALID_ENTRYPOINT);
    }
  } else {
    throw new Error(IDPMetadataParseErrors.INVALID_ENTRYPOINT);
  }
}
export const parseMetadataFields = async (
  ssoIdpMetadata: string
): Promise<ParsedMetadataFields> => {
  const idpMetaDataCleaned = ssoIdpMetadata.trim().replace(/[\r\n\t]/gm, "");
  const metadataParsed = await parseMetaData(idpMetaDataCleaned);
  const samlIdpCertificate = getIDPCertificate(metadataParsed);
  const samlIdpEntryPoint = getIDPEntrypoint(metadataParsed);
  return {
    samlIdpCertificate,
    samlIdpEntryPoint,
  };
};
export const parseMetadataFieldsHandler = async (
  _unusedServices: CoreServices,
  { ssoIdpMetadata }: ParseMetadataFieldsRequest
): Promise<ParseMetadataFieldsResult> => {
  try {
    const { samlIdpCertificate, samlIdpEntryPoint } = await parseMetadataFields(
      ssoIdpMetadata
    );
    return {
      success: true,
      data: {
        samlIdpCertificate,
        samlIdpEntryPoint,
      },
    };
  } catch (e) {
    const xmlErrors: string[] = Object.values(IDPXmlParseErrors);
    const parseErrors: string[] = Object.values(IDPMetadataParseErrors);
    const possibleErrors = xmlErrors.concat(parseErrors);
    const error = possibleErrors.includes(e.message)
      ? e.message
      : IDPXmlParseErrors.XML_PARSE_FAILED;
    return {
      success: false,
      error,
    };
  }
};
