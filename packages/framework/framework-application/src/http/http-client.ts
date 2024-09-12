import {
  HttpBackend,
  HttpClient as HttpClientService,
} from "@dashlane/framework-services";
import { Injectable } from "../dependency-injection/injectable.decorator";
@Injectable()
export class HttpClient extends HttpClientService {
  constructor(infrastructure: HttpBackend) {
    super(infrastructure);
  }
}
