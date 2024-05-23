import { isValidElement, ReactNode } from 'react';
import { jsx, Paragraph } from '@dashlane/design-system';
import { InternalRedirectButton } from 'team/settings/components/layout/internal-redirect-button';
import { InfoCard } from './info-card';
import { ExternalLink } from './external-link';
export enum LinkType {
    ExternalLink,
    InternalLink
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
export const LinkCard = ({ heading, description, linkText, supportHeading, linkProps, }: LinkCardPropsBase) => {
    return (<InfoCard supportHeader={supportHeading}>
      <Paragraph sx={{ mb: '8px' }} color="ds.text.neutral.catchy" textStyle="ds.title.block.medium" as="h3">
        {heading}
      </Paragraph>
      {isValidElement(description) ? (description) : (<Paragraph color="ds.text.neutral.standard" textStyle="ds.body.standard.regular" sx={{
                mb: linkText &&
                    linkProps.linkType === LinkType.ExternalLink &&
                    linkProps.linkHref
                    ? '24px'
                    : 0,
            }}>
          {description}
        </Paragraph>)}
      {linkProps.linkType === LinkType.ExternalLink && linkProps.linkHref ? (<ExternalLink href={linkProps.linkHref}>{linkText}</ExternalLink>) : null}
      {linkProps.linkType === LinkType.InternalLink ? (<InternalRedirectButton linkText={linkText} internalAction={linkProps.internalAction}/>) : null}
    </InfoCard>);
};
export { ExternalLink };
