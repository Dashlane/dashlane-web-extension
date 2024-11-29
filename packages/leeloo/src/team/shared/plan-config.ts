export interface PricingTileData {
  currentPlan?: boolean;
  currentTrial?: boolean;
  recommended?: boolean;
  planName: string;
  price:
    | string
    | {
        key: string;
        variables?: Record<string, unknown>;
      }
    | null;
  equivalentPrice?: string | null;
  limitedOffer?: boolean;
  heading: {
    key: string;
    variables?: Record<string, unknown>;
  };
  priceDescription1: {
    key: string;
    variables?: Record<string, unknown>;
  };
  priceDescription2: {
    key: string;
    variables?: Record<string, unknown>;
  };
  features: {
    key: string;
    icon?: "check";
    loading?: boolean;
    variables?: Record<string, unknown>;
  }[];
  footer?: {
    key: string;
    variables?: Record<string, unknown>;
  };
  showRecommendedBadge?: boolean;
  showUpgradeInfobox?: boolean;
  isStandardPlanRestricted?: boolean;
}
export interface PricingPlanData {
  standard: PricingTileData;
  standardUpgradeBusiness?: PricingTileData;
  starter?: PricingTileData;
  business: PricingTileData;
  businessPlus?: PricingTileData;
}
export const basePlanConfig: PricingPlanData = {
  standard: {
    planName: "standard",
    price: null,
    heading: { key: "manage_subscription_plan_name_standard" },
    priceDescription1: {
      key: "team_post_trial_checkout_plan_selection_standard_card_seats",
    },
    priceDescription2: {
      key: "team_account_teamplan_changeplan_plans_billed_anually",
    },
    features: [
      {
        icon: "check",
        key: "team_post_trial_checkout_plan_selection_standard_card_feature_coverage",
      },
      {
        icon: "check",
        key: "team_account_teamplan_changeplan_plans_passwords",
      },
      {
        icon: "check",
        key: "team_account_teamplan_changeplan_plans_collections",
      },
      {
        icon: "check",
        key: "team_account_teamplan_changeplan_plans_admin_console",
      },
      {
        icon: "check",
        key: "team_post_trial_checkout_plan_selection_standard_card_feature_health_score",
      },
      {
        icon: "check",
        key: "team_account_teamplan_changeplan_plans_standard_activity_logs",
      },
      {
        icon: "check",
        key: "team_account_teamplan_changeplan_plans_account_recovery",
      },
      {
        icon: "check",
        key: "team_audit_log_category_dark_web_monitoring",
      },
    ],
  },
  business: {
    planName: "business",
    price: null,
    heading: {
      key: "team_account_teamplan_changeplan_plans_business_name_V2",
    },
    priceDescription1: {
      key: "team_account_teamplan_changeplan_plans_per_seat_month",
    },
    priceDescription2: {
      key: "team_account_teamplan_changeplan_plans_billed_anually",
    },
    features: [
      {
        key: "team_post_trial_checkout_plan_selection_biz_card_feature_everything_in_standard_markup",
        icon: "check",
      },
      {
        key: "team_account_teamplan_changeplan_plans_unlimited_seats",
      },
      {
        key: "team_post_trial_checkout_plan_selection_biz_card_feature_sharing",
      },
      {
        key: "team_account_teamplan_changeplan_plans_phishing",
      },
      {
        key: "team_account_teamplan_changeplan_plans_sso_integration",
      },
      {
        key: "team_account_teamplan_changeplan_plans_scim_provisioning",
      },
      {
        key: "team_post_trial_checkout_plan_selection_biz_card_feature_siem",
      },
      {
        key: "team_account_teamplan_changeplan_plans_activity_logs",
      },
      {
        key: "team_post_trial_checkout_plan_selection_biz_card_feature_policies",
      },
      {
        key: "team_account_teamplan_changeplan_plans_vpn_for_wifi_protection",
      },
      {
        key: "team_account_teamplan_changeplan_plans_free_friends_family_plan",
      },
    ],
  },
};
export const getPlanConfig = (overrides = {}): PricingPlanData => {
  return { ...basePlanConfig, ...overrides };
};
