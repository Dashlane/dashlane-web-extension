import { clearCache as clearPremiumCache } from './Premium';
import { clearCache as clearTeamPlansCache } from './TeamPlans';
export function clearCache() {
    clearPremiumCache();
    clearTeamPlansCache();
}
