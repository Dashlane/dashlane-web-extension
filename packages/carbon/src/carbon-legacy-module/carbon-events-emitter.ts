import { carbonLegacyApi } from "@dashlane/communication";
import {
  ContextlessBaseEventEmitter,
  Injectable,
} from "@dashlane/framework-application";
@Injectable()
export class CarbonEventEmitter extends ContextlessBaseEventEmitter<
  typeof carbonLegacyApi
> {}
