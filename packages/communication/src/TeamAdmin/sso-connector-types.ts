import { RegisterTeamDeviceError } from "./device-types";
import {
  IDPMetadataParseErrors,
  IDPXmlParseErrors,
} from "./saml-metadata-parser-types";
export interface CreateConfigRequest {
  connectorKey: string;
  connectorUrl: string;
  idpMetadata: string;
}
export type CreateConfigSuccess = {
  success: true;
  config: string;
};
export type CreateConfigErrors =
  | IDPXmlParseErrors
  | IDPMetadataParseErrors
  | RegisterTeamDeviceError;
export type CreateConfigFailure = {
  success: false;
  error: {
    code: CreateConfigErrors;
  };
};
export type CreateConfigResult = CreateConfigSuccess | CreateConfigFailure;
