import { Button, Infobox } from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import { BUSINESS_PLANS } from "../../urls";
const I18N_KEYS = {
  TITLE: "team_group_list_in_trial_business_paywall_block_title",
  DESCRIPTION: "team_group_list_in_trial_business_paywall_block_description",
  UPGRADE: "team_group_list_in_trial_business_paywall_block_upgrade",
};
interface InTrialBusinessPaywallProps {
  className?: string;
}
export const InTrialBusinessPaywall = ({
  className,
}: InTrialBusinessPaywallProps) => {
  const { translate } = useTranslate();
  const PAYEMENT_URL = BUSINESS_PLANS;
  const handleOnUpgrade = () => {};
  return (
    <Infobox
      title={translate(I18N_KEYS.TITLE)}
      description={translate(I18N_KEYS.DESCRIPTION)}
      mood="brand"
      size="large"
      actions={[
        <Button
          key="upgrade"
          onClick={handleOnUpgrade}
          as="a"
          href={PAYEMENT_URL}
          rel="noreferrer"
          target="_blank"
        >
          {translate(I18N_KEYS.UPGRADE)}
        </Button>,
      ]}
      className={className}
    />
  );
};
