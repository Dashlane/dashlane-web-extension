import {
  Button,
  Heading,
  LinkButton,
  Paragraph,
} from "@dashlane/design-system";
import useTranslate from "../../../libs/i18n/useTranslate";
import { Link } from "../../../libs/router";
interface Props {
  subCardDescription?: string;
  subCardHeader: JSX.Element;
  image?: string;
  externalLink?: string;
  externalLinkTitle?: string;
  externalLinkOnClick?: () => void;
  isMainButtonDisabled?: boolean;
  mainButtonTitle?: string;
  mainButtonLink?: string;
  mainButtonOnClick?: () => void;
  secondButtonTitle?: string;
  secondButtonLink?: string;
  upgradeButtonLink?: string;
  isCapable: boolean;
}
const I18N_KEYS = {
  UPGRADE_BUSINESS:
    "team_settings_directory_sync_scim_paywall_upgrade_business",
  ALT_IMAGE: "team_integrations_alt_image",
};
export const IntegrationCardSubcard = ({
  subCardDescription,
  subCardHeader,
  image,
  externalLink,
  externalLinkTitle,
  externalLinkOnClick,
  isMainButtonDisabled = false,
  mainButtonTitle,
  mainButtonLink,
  mainButtonOnClick,
  secondButtonTitle,
  secondButtonLink,
  upgradeButtonLink,
  isCapable,
}: Props) => {
  const { translate } = useTranslate();
  return (
    <div
      sx={{
        display: "flex",
        flex: 1,
        backgroundColor: "ds.background.alternate",
        padding: "24px",
        borderRadius: "8px",
      }}
    >
      <div
        sx={{
          display: "flex",
          flex: image ? 3 : 1,
          flexDirection: "column",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <Heading
          as="h2"
          textStyle="ds.title.block.medium"
          color="ds.text.neutral.catchy"
        >
          {subCardHeader}
        </Heading>
        {subCardDescription ||
        externalLink ||
        mainButtonLink ||
        upgradeButtonLink ? (
          <div sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {subCardDescription ? (
              <Paragraph
                textStyle="ds.body.standard.regular"
                color="ds.text.neutral.standard"
              >
                {subCardDescription}
              </Paragraph>
            ) : null}
            {!!externalLink && (
              <LinkButton
                href={externalLink}
                isExternal={true}
                onClick={externalLinkOnClick}
              >
                {externalLinkTitle}
              </LinkButton>
            )}
            {isCapable && mainButtonLink ? (
              <div sx={{ display: "flex", gap: "8px" }}>
                <Button
                  as={Link}
                  to={mainButtonLink}
                  disabled={isMainButtonDisabled}
                  onClick={mainButtonOnClick}
                >
                  {mainButtonTitle}
                </Button>
                {secondButtonLink ? (
                  <Button
                    as={Link}
                    to={secondButtonLink}
                    mood="neutral"
                    intensity="quiet"
                  >
                    {secondButtonTitle}
                  </Button>
                ) : null}
              </div>
            ) : (
              upgradeButtonLink && (
                <Button
                  as={Link}
                  to={upgradeButtonLink}
                  layout="iconLeading"
                  icon="PremiumOutlined"
                  mood="brand"
                  intensity="catchy"
                >
                  {translate(I18N_KEYS.UPGRADE_BUSINESS)}
                </Button>
              )
            )}
          </div>
        ) : null}
      </div>
      {image && (
        <div sx={{ display: "flex", justifyContent: "end", flex: 1 }}>
          <img
            role="presentation"
            alt=""
            src={image}
            sx={{
              objectFit: "contain",
              width: "100%",
              height: "auto",
              maxWidth: "200px",
            }}
          />
        </div>
      )}
    </div>
  );
};
