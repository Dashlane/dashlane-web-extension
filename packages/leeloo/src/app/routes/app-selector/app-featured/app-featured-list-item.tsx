import { Heading, Icon, IconProps, jsx, Paragraph, } from '@dashlane/design-system';
import { FlexContainer } from '@dashlane/ui-components';
import { Link } from 'libs/router';
import { AppLink } from '../types/app-link';
import { SX_STYLES } from '../styles';
interface AppFeaturedProps {
    to: string;
    app: 'leeloo' | 'console';
    links: AppLink[];
}
export const AppFeaturedListItem = ({ to, app, links }: AppFeaturedProps) => {
    const application: Record<string, {
        iconName: IconProps['name'];
        name: string;
        label: string;
    }> = {
        leeloo: {
            iconName: 'WebOutlined',
            name: 'Leeloo',
            label: 'Web Client',
        },
        console: {
            iconName: 'DashboardOutlined',
            name: 'Console',
            label: 'Team Admin Console',
        },
    };
    const linkProps = {
        sx: {
            color: 'ds.text.brand.quiet',
            textDecoration: 'none',
            width: '100%',
            display: 'block',
            '&:focus-within, &:hover': {
                textDecoration: 'underline',
            },
        },
    };
    return (<FlexContainer flexDirection="column">
      <div sx={{
            padding: '8px',
            border: '1px solid transparent',
            borderColor: 'ds.border.neutral.quiet.idle',
            borderRadius: '8px',
            backgroundColor: 'ds.container.agnostic.neutral.supershy',
        }}>
        <Link to={to} sx={{
            textDecoration: 'none',
            borderRadius: '4px',
            display: 'grid',
            gridTemplateColumns: '36px 1fr 24px',
            gap: '16px',
            padding: '16px',
            alignItems: 'center',
            '&:hover, &:focus-within': {
                backgroundColor: 'ds.container.expressive.neutral.supershy.hover',
            },
        }}>
          <div sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '36px',
            width: '36px',
            borderRadius: '12px',
            backgroundColor: 'ds.container.expressive.neutral.quiet.disabled',
            padding: '8px',
        }}>
            <Icon name={application[app].iconName} color="ds.text.neutral.standard" size="medium"/>
          </div>
          <div sx={{ display: 'flex', flexDirection: 'column' }}>
            <Heading as="h3" textStyle="ds.title.supporting.small" color="ds.text.neutral.quiet">
              {application[app].label}
            </Heading>
            <Paragraph textStyle="ds.title.section.medium" color="ds.text.neutral.catchy">
              {application[app].name}
            </Paragraph>
          </div>
          <Icon name="ActionOpenExternalLinkOutlined" size="large" color="ds.text.brand.standard"/>
        </Link>
        <div>
          <div sx={{
            display: 'flex',
            flexDirection: 'column',
            padding: '0 16px 16px 16px',
        }}>
            {links.map((link) => (<div key={link.to} sx={{
                borderTop: '1px solid transparent',
                borderTopColor: 'ds.border.neutral.quiet.idle',
                padding: '16px 0',
                '&:first-of-type': {
                    borderTopColor: 'transparent',
                },
                '&:last-of-type': {
                    paddingBottom: '0',
                },
            }}>
                <div sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '4px',
            }}>
                  {link.asAnchor ? (<a {...linkProps} href={link.to} sx={SX_STYLES.LINK}>
                      {link.content}
                    </a>) : (<Link {...linkProps} to={link.to} sx={SX_STYLES.LINK}>
                      {link.content}
                    </Link>)}
                  <Icon name="ActionOpenExternalLinkOutlined" color="ds.text.brand.standard"/>
                </div>
                {link.extraContent ? (<div sx={{ color: 'ds.text.neutral.quiet', marginTop: '8px' }}>
                    {link.extraContent}
                  </div>) : null}
              </div>))}
          </div>
        </div>
      </div>
    </FlexContainer>);
};
