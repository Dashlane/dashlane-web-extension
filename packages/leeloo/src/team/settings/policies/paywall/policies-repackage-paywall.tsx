import { Card, ThemeUIStyleObject } from "@dashlane/design-system";
import { useIsStandard } from "../../../helpers/use-is-standard";
import { UpgradeTile } from "../../../upgrade-tile/upgrade-tile";
import { StarterPoliciesChangePaywall } from "./starter-policies-change-paywall";
import { BusinessInTrialPoliciesPaywall } from "./business-in-trial-policies-paywall";
import { AdvancedPoliciesUpgradeTile } from "./advanced-policies-upgrade-tile";
import { useAdvancedPoliciesPermission } from "./use-advanced-policies-permision";
const SX_STYLES: Record<string, Partial<ThemeUIStyleObject>> = {
  CONTAINER: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    marginBottom: "24px",
  },
};
export const PoliciesRepackagePaywall = () => {
  const { hasStarterPaywall, hasTrialBusinessPaywall } =
    useAdvancedPoliciesPermission();
  const isStandardPlan = useIsStandard();
  if (isStandardPlan) {
    return (
      <div sx={SX_STYLES.CONTAINER}>
        <Card
          sx={{
            padding: "16px",
            backgroundColor: "ds.container.agnostic.neutral.supershy",
            borderColor: "ds.border.neutral.quiet.idle",
          }}
        >
          <UpgradeTile />
        </Card>
      </div>
    );
  } else if (hasStarterPaywall) {
    return (
      <div sx={SX_STYLES.CONTAINER}>
        <StarterPoliciesChangePaywall />
        <AdvancedPoliciesUpgradeTile />
      </div>
    );
  } else if (hasTrialBusinessPaywall) {
    return (
      <BusinessInTrialPoliciesPaywall
        sx={{ alignContent: "start", height: "100%" }}
      />
    );
  }
  return null;
};
