import {
  CarbonEndpointResult,
  useCarbonQuery,
} from "@dashlane/carbon-api-consumers";
import { PersonalSettings } from "@dashlane/communication";
import { carbonConnector } from "../connector";
export const usePersonalSettings = (): CarbonEndpointResult<PersonalSettings> =>
  useCarbonQuery(
    {
      query: carbonConnector.getPersonalSettings,
      queryParam: null,
    },
    []
  );
