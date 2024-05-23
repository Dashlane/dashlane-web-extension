import { Icon, jsx } from '@dashlane/design-system';
import { Link } from 'libs/router';
import { AppLink } from '../types/app-link';
import { SX_STYLES } from '../styles';
export const AppLinkListItem = ({ to, content, extraContent, asAnchor = false, }: AppLink) => {
    return (<li sx={{
            color: 'ds.text.neutral.standard',
            display: 'inline-block',
        }}>
      <div sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '4px',
        }}>
        {asAnchor ? (<a href={to} sx={SX_STYLES.LINK} rel="noopener noreferrer">
            {content}
          </a>) : (<Link to={to} sx={SX_STYLES.LINK}>
            {content}
          </Link>)}
        <Icon name="ActionOpenExternalLinkOutlined" color="ds.text.brand.standard"/>
      </div>
      {extraContent ? (<div sx={{ color: 'ds.text.neutral.quiet', marginTop: '8px' }}>
          {extraContent}
        </div>) : null}
    </li>);
};
