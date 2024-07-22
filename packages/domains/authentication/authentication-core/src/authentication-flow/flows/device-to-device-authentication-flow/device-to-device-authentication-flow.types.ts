import { AuthenticationFlowContracts } from "@dashlane/authentication-contracts";
export interface RequestTransferResponseData {
  transferId: string;
  expireDateUnix: number;
}
export interface StartReceiverKeyExchangeResponseData {
  receiverPublicKey: string;
  receiverPrivateKey: string;
  senderPublicKey: string;
}
export interface CompleteKeyExchangeAndGeneratePassphraseResponseData {
  passphrase: string;
  sharedSecret: string;
}
export interface StartTransferResponseData {
  encryptedData: string;
  nonce: string;
}
export class DeviceToDeviceAuthenticationError extends Error {
  public code: AuthenticationFlowContracts.DeviceToDeviceAuthenticationErrors;
  constructor(
    message: string,
    code: AuthenticationFlowContracts.DeviceToDeviceAuthenticationErrors
  ) {
    super(message);
    this.code = code;
  }
}
