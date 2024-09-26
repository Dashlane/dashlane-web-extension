import { StoreService } from "Store";
import { CredentialRepository } from "DataManagement/Breaches/Repositories/interfaces";
import { credentialsSelector } from "DataManagement/Credentials/selectors/credentials.selector";
export class CredentialVault implements CredentialRepository {
  public constructor(private storeService: StoreService) {}
  public getAllCredentials() {
    const state = this.storeService.getState();
    return credentialsSelector(state);
  }
}
