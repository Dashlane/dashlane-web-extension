import { z } from "zod";
import { KillSwitches } from "@dashlane/framework-contracts";
import { getKillSwitches } from "Libs/DashlaneApi/services/killswitch/get-killswitches";
import { isApiError } from "Libs/DashlaneApi";
import { StoreService } from "Store";
import { killswitchStateUpdated } from "Device/Store/killswitch/actions";
const killSwitchesSchema = z.object({
  disableAutofill: z.boolean().default(false),
  brazeContentCardsDisabled: z.boolean().default(false),
  disableLoginFlowMigration: z.boolean().default(false),
  disableAutoSSOLogin: z.boolean().default(false),
});
export const updateKillswitchState = async (storeService: StoreService) => {
  const requestedKillswitches = Object.values(KillSwitches);
  const response = await getKillSwitches(storeService, requestedKillswitches);
  if (isApiError(response)) {
    throw new Error(
      `[Killswitch] - updateKillswitchState : ${response.message} (${response.code})`
    );
  }
  const parsed = killSwitchesSchema.safeParse(response);
  if (!parsed.success) {
    throw new Error(
      "[Killswitch] - updateKillswitchState: unexpected server response shape"
    );
  }
  storeService.dispatch(
    killswitchStateUpdated({
      disableAutofill: parsed.data.disableAutofill || false,
      brazeContentCardsDisabled: parsed.data.brazeContentCardsDisabled || false,
      disableLoginFlowMigration: parsed.data.disableLoginFlowMigration || false,
      disableAutoSSOLogin: parsed.data.disableAutoSSOLogin || false,
    })
  );
};
