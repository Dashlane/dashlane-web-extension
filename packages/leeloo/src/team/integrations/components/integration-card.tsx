import { IntegrationCardContainer } from "./integration-card-container";
import { IntegrationCardSubcard } from "./integration-card-subcard";
interface Props {
  containerTitle: string;
  containerDescription?: string;
  subCardDescription?: string;
  subCardHeader: JSX.Element;
  image?: string;
  externalLink?: string;
  externalLinkTitle?: string;
  externalLinkOnClick?: () => void;
  isMainButtonDisabled?: boolean;
  disabledReason?: string;
  mainButtonTitle?: string;
  mainButtonLink?: string;
  mainButtonOnClick?: () => void;
  secondButtonTitle?: string;
  secondButtonLink?: string;
  badgeLabel: string;
  upgradeButtonLink?: string;
  isCapable: boolean;
}
export const IntegrationCard = ({
  containerTitle,
  containerDescription,
  subCardDescription,
  subCardHeader,
  image,
  externalLink,
  externalLinkTitle,
  externalLinkOnClick,
  isMainButtonDisabled = false,
  disabledReason,
  mainButtonTitle,
  mainButtonLink,
  mainButtonOnClick,
  secondButtonTitle,
  secondButtonLink,
  badgeLabel,
  upgradeButtonLink,
  isCapable,
}: Props) => {
  return (
    <IntegrationCardContainer
      containerTitle={containerTitle}
      containerDescription={containerDescription}
      isMainButtonDisabled={isMainButtonDisabled}
      disabledReason={disabledReason}
      mainButtonLink={mainButtonLink}
      badgeLabel={badgeLabel}
      isCapable={isCapable}
    >
      <IntegrationCardSubcard
        subCardDescription={subCardDescription}
        subCardHeader={subCardHeader}
        image={image}
        externalLink={externalLink}
        externalLinkTitle={externalLinkTitle}
        externalLinkOnClick={externalLinkOnClick}
        isMainButtonDisabled={isMainButtonDisabled}
        mainButtonTitle={mainButtonTitle}
        mainButtonLink={mainButtonLink}
        mainButtonOnClick={mainButtonOnClick}
        secondButtonTitle={secondButtonTitle}
        secondButtonLink={secondButtonLink}
        upgradeButtonLink={upgradeButtonLink}
        isCapable={isCapable}
      />
    </IntegrationCardContainer>
  );
};
