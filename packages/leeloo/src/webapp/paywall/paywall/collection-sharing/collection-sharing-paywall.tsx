import { Button, ButtonIntensity, Infobox } from "@dashlane/design-system";
import {
  ClickOrigin,
  Button as HermesButton,
  UserClickEvent,
} from "@dashlane/hermes";
import useTranslate from "../../../../libs/i18n/useTranslate";
import { logEvent } from "../../../../libs/logs/logEvent";
import { Link, useRouterGlobalSettingsContext } from "../../../../libs/router";
const I18N_KEYS = {
  WARN_TITLE: "webapp_collections_paywall_warn_title",
  WARN_DESCRIPTION: "webapp_collections_paywall_warn_description",
  BLOCK_TITLE: "webapp_collections_paywall_block_title",
  BLOCK_DESCRIPTION: "webapp_collections_paywall_block_description",
  UPGRADE_CTA: "webapp_collections_paywall_upgrade_cta",
};
interface CollectionViewPaywallProps {
  canShareCollection: boolean;
  buttonIntensity?: ButtonIntensity;
  clickOrigin: ClickOrigin;
  className?: string;
}
export const CollectionSharingPaywall = ({
  canShareCollection,
  buttonIntensity,
  clickOrigin,
  className,
}: CollectionViewPaywallProps) => {
  const { translate } = useTranslate();
  const { routes } = useRouterGlobalSettingsContext();
  const handleOnClick = () => {
    logEvent(
      new UserClickEvent({
        button: HermesButton.UpgradeBusinessTier,
        clickOrigin,
      })
    );
  };
  return (
    <Infobox
      title={translate(
        canShareCollection ? I18N_KEYS.WARN_TITLE : I18N_KEYS.BLOCK_TITLE
      )}
      description={translate(
        canShareCollection
          ? I18N_KEYS.WARN_DESCRIPTION
          : I18N_KEYS.BLOCK_DESCRIPTION
      )}
      actions={[
        <Button
          key="upgrade"
          layout="iconLeading"
          icon="PremiumOutlined"
          intensity={buttonIntensity}
          onClick={handleOnClick}
          as={Link}
          to={`${routes.teamAccountChangePlanRoutePath}?plan=business`}
        >
          {translate(I18N_KEYS.UPGRADE_CTA)}
        </Button>,
      ]}
      mood={canShareCollection ? "brand" : "warning"}
      size="large"
      icon={!canShareCollection ? "FeedbackFailOutlined" : undefined}
      className={className}
    />
  );
};
