import { Injectable } from "@dashlane/framework-application";
import { SsoProviderInfoStore } from "../../stores/sso-provider-info.store";
import { CarbonLegacySsoRedirectionToIdpRequiredEvent } from "./authentication.events";
@Injectable()
export class StoreSSOInfoService {
  public constructor(private ssoProviderInfoStore: SsoProviderInfoStore) {
    this.ssoProviderInfoStore = ssoProviderInfoStore;
  }
  public async execute({
    isNitroProvider,
    serviceProviderRedirectUrl,
  }: CarbonLegacySsoRedirectionToIdpRequiredEvent) {
    await this.ssoProviderInfoStore.set({
      isNitroProvider,
      serviceProviderUrl: serviceProviderRedirectUrl,
    });
  }
}
