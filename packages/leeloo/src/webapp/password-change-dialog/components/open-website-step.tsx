import { jsx, Paragraph } from '@dashlane/design-system';
import { IconDataStructure } from '@dashlane/communication';
import { Thumbnail } from '@dashlane/ui-components';
import { getBackgroundColor } from 'libs/dashlane-style/credential-info/getBackgroundColor';
export interface OpenWebsiteProps {
    translation: string;
    domainIcon?: IconDataStructure;
    hostname: string;
}
export const OpenWebsiteStep = ({ translation, domainIcon, hostname, }: OpenWebsiteProps) => {
    const [beforeLogo, , afterLogo] = translation.split('_');
    const iconSource = domainIcon?.urls['46x30@2x'] || undefined;
    const backgroundColor = getBackgroundColor({
        backgroundColor: domainIcon?.backgroundColor,
        mainColor: domainIcon?.mainColor,
        iconSource,
    });
    return (<Paragraph textStyle="ds.body.standard.regular" color="ds.text.neutral.standard">
      {beforeLogo}
      <span sx={{
            display: 'inline-block',
            verticalAlign: 'bottom',
            marginLeft: '6px',
            marginRight: '4px',
        }}>
        <Thumbnail size="xsmall" iconSource={iconSource} backgroundColor={backgroundColor} text={hostname}/>
      </span>

      <span sx={{
            fontWeight: '600',
        }}>
        {hostname}
      </span>
      {afterLogo}
    </Paragraph>);
};
