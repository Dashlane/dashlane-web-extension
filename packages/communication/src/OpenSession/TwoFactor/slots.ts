import { slot } from "ts-event-bus";
import { liveSlot } from "../../CarbonApi";
import { TwoFactorAuthenticationInfo } from "./types";
export const twoFactorStatusSlots = {
  getTwoFactorAuthenticationInfo: slot<void, TwoFactorAuthenticationInfo>(),
};
export const twoFactorStatusLiveSlots = {
  liveTwoFactorAuthenticationInfo: liveSlot<TwoFactorAuthenticationInfo>(),
};
