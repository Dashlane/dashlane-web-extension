export type RequestPairingResult =
  | {
      pairingId: string;
    }
  | undefined;
export interface PairingService {
  requestPairing: (login: string) => Promise<RequestPairingResult>;
}
