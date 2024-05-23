import { jsx } from '@dashlane/design-system';
import { FlexContainer, Paragraph, PropsOf } from '@dashlane/ui-components';
import { LinkCard, LinkType } from '../../components/layout/link-card';
import { SIDE_CARDS_VALUES } from './text-content';
const SideCardList = ({ listIntro, list, }: {
    listIntro: string;
    list: string[];
}) => (<div>
    <Paragraph color="ds.text.neutral.standard" size="small">
      {listIntro}
    </Paragraph>
    <ul sx={{ listStyleType: 'disc', mt: '8px', mb: '24px', ml: '24px' }}>
      {list.map((itemText, index) => (<Paragraph as="li" size="small" key={itemText ?? index}>
          {itemText}
        </Paragraph>))}
    </ul>
  </div>);
export const SideContent = (params: PropsOf<typeof FlexContainer>) => (<FlexContainer gap="32px" flexDirection="column" {...params}>
    {SIDE_CARDS_VALUES.map(({ heading, description, listIntro, list, linkText, linkHref }) => {
        const descriptionContent = listIntro && list ? (<SideCardList listIntro={listIntro} list={list}/>) : (description);
        return (<LinkCard linkProps={{
                linkType: LinkType.ExternalLink,
                linkHref,
            }} key={heading} heading={heading} description={descriptionContent} linkText={linkText}/>);
    })}
  </FlexContainer>);
