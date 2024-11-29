import { isValidElement, ReactNode } from "react";
import { Heading, LinkButton, Paragraph } from "@dashlane/design-system";
import { InfoCard } from "./info-card";
import { ExternalLink } from "./external-link";
export enum LinkType {
  ExternalLink,
  InternalLink,
}
interface LinkCardPropsBase {
  heading: ReactNode;
  description: ReactNode;
  linkText?: ReactNode;
  supportHeading?: ReactNode;
  linkProps: LinkCardProps;
}
type ExternalLinkProps = {
  linkType: LinkType.ExternalLink;
  linkHref?: string;
  onClick?: () => void;
};
type InternalLinkProps = {
  linkType: LinkType.InternalLink;
  internalAction: () => void;
};
type LinkCardProps = ExternalLinkProps | InternalLinkProps;
export const LinkCard = ({
  heading,
  description,
  linkText,
  supportHeading,
  linkProps,
}: LinkCardPropsBase) => {
  return (
    <InfoCard supportHeader={supportHeading}>
      <Heading
        as="h3"
        sx={{ marginBottom: "8px" }}
        color="ds.text.neutral.catchy"
        textStyle="ds.title.block.medium"
      >
        {heading}
      </Heading>
      {isValidElement(description) ? (
        description
      ) : (
        <Paragraph
          color="ds.text.neutral.standard"
          textStyle="ds.body.standard.regular"
          sx={{
            marginBottom:
              linkText &&
              linkProps.linkType === LinkType.ExternalLink &&
              linkProps.linkHref
                ? "24px"
                : 0,
          }}
        >
          {description}
        </Paragraph>
      )}
      {linkProps.linkType === LinkType.ExternalLink && linkProps.linkHref ? (
        <ExternalLink href={linkProps.linkHref}>{linkText}</ExternalLink>
      ) : null}
      {linkProps.linkType === LinkType.InternalLink ? (
        <LinkButton onClick={linkProps.internalAction}>{linkText}</LinkButton>
      ) : null}
    </InfoCard>
  );
};
export { ExternalLink };
