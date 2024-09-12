import type { HttpBackend } from "@dashlane/framework-services";
export class HttpInfrastructure {
  public backend: HttpBackend;
  public constructor(backend: HttpBackend) {
    this.backend = backend;
  }
}
